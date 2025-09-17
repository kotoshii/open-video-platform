import { ForbiddenException, Inject, Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { KafkaEventTypes } from "@ovp-lib/api/kafka/constants/event-types";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { VideoViewedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/video-viewed-kafka-event-payload.dto";
import { KafkaProducerService } from "@ovp-lib/api/kafka/services/kafka-producer.service";
import { ChannelKafkaEventPayload } from "@ovp-lib/api/kafka/types/events/channels";
import { PaginatedResponseDto } from "@ovp-lib/api/pagination/dto/paginated-response.dto";
import { jsonParseOrNull } from "@ovp-lib/common/utils/json";
import { CHANNEL_SERVICE_NAME, CHANNELS_PACKAGE_NAME, ChannelServiceClient } from "@ovp-proto/types/channels";
import { USER_SERVICE_NAME, USERS_PACKAGE_NAME, UserServiceClient } from "@ovp-proto/types/users";
import { EachMessagePayload } from "kafkajs";
import _ from "lodash";

import { VideoVisibility } from "~db/schema";
import { EditVideoDetailsDto } from "~src/videos/dto/edit-video-details.dto";
import { GetVideoDto } from "~src/videos/dto/get-video.dto";
import { GetVideoForChannelDto } from "~src/videos/dto/get-video-for-channel.dto";
import { GetVideoForEditingDto } from "~src/videos/dto/get-video-for-editing.dto";
import { GetVideoForViewerDto } from "~src/videos/dto/get-video-for-viewer.dto";
import { GetVideosForChannelFilterDto } from "~src/videos/dto/get-videos-for-channel-filter.dto";
import { GetVideosForChannelPaginationOptionsDto } from "~src/videos/dto/get-videos-for-channel-pagination-options.dto";
import { VideoRepository } from "~src/videos/repositories/video.repository";

@Injectable()
export class VideoService implements OnModuleInit {
	private readonly logger = new Logger(VideoService.name);

	private userGrpcService: UserServiceClient;
	private channelGrpcService: ChannelServiceClient;

	constructor(
		@Inject(USERS_PACKAGE_NAME) private userClientGrpc: ClientGrpc,
		@Inject(CHANNELS_PACKAGE_NAME) private channelClientGrpc: ClientGrpc,

		private readonly kafkaProducerService: KafkaProducerService,
		private readonly videoRepository: VideoRepository,
	) {}

	onModuleInit() {
		this.userGrpcService = this.userClientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
		this.channelGrpcService = this.channelClientGrpc.getService<ChannelServiceClient>(CHANNEL_SERVICE_NAME);
	}

	async handleChannelEvents(payload: EachMessagePayload) {
		try {
			const message = payload.message.value
				? jsonParseOrNull<ChannelKafkaEventPayload>(payload.message.value.toString())
				: null;

			if (!message) {
				this.logger.error(
					`Kafka event skipped: Invalid message schema for "${KafkaTopic.ChannelEvents}" topic: ${payload.message.value}`,
				);
				return;
			}

			if (message.type === KafkaEventTypes.Channels.ChannelUpdated) {
				await this.videoRepository.updateVideosByChannelId(message.channelId, {
					channelName: message.name,
				});
			}

			await payload.heartbeat();
		} catch (e) {
			this.logger.error(`Error in "${KafkaTopic.ChannelEvents}" topic handler: ${e}`);
			throw e;
		}
	}

	async createVideoOrThrow(title: string, channelId: string) {
		const channel = await this.getChannelById(channelId);

		if (!channel) {
			throw new NotFoundException("Failed to create a video: provided channel ID does not exist");
		}

		const video = await this.videoRepository.createVideo({
			title,
			channelId,
			channelName: channel.name,
		});

		return new GetVideoDto(video);
	}

	async getVideoByIdForUser(videoId: string, userId: string, channelId: string) {
		const video = await this.videoRepository.getVideoById(videoId);

		if (!video) {
			return null;
		}

		const isAuthor = video.channelId === channelId;

		if (!isAuthor && !video.isPublished) {
			return null;
		}

		if (!isAuthor && video.visibility === VideoVisibility.Private) {
			return null;
		}

		if (!isAuthor && video.isNsfw) {
			const canAccessNsfw = await this.canAccessNsfw(userId);

			if (!canAccessNsfw) {
				return null;
			}
		}

		return new GetVideoDto(video);
	}

	async getVideoByIdOrThrow(videoId: string, userId: string, channelId: string) {
		const video = await this.videoRepository.getVideoById(videoId);

		if (!video) {
			throw new NotFoundException("Video not found");
		}

		const isAuthor = video.channelId === channelId;

		if (!isAuthor && !video.isPublished) {
			throw new NotFoundException("Video not found");
		}

		if (!isAuthor && video.visibility === VideoVisibility.Private) {
			throw new ForbiddenException("You do not have permissions to view this content");
		}

		if (!isAuthor && video.isNsfw) {
			const canAccessNsfw = await this.canAccessNsfw(userId);

			if (!canAccessNsfw) {
				throw new ForbiddenException("You do not have permissions to view this content");
			}
		}

		return new GetVideoDto(video);
	}

	async getVideoByIdForAuthorOrThrow(videoId: string, channelId: string) {
		const video = await this.videoRepository.getVideoById(videoId);

		if (!video) {
			throw new NotFoundException("Video not found");
		}

		const isAuthor = video.channelId === channelId;

		if (!isAuthor) {
			throw new ForbiddenException("You do not have permissions to view this content");
		}

		return new GetVideoDto(video);
	}

	async watchVideoByIdOrThrow(
		videoId: string,
		userId: string,
		channelId: string,
		userAgent: string,
		ipAddress: string,
	) {
		const video = await this.getVideoByIdOrThrow(videoId, userId, channelId);

		void this.kafkaProducerService.emit(
			KafkaTopic.VideoEvents,
			new VideoViewedKafkaEventPayloadDto(videoId, channelId, userAgent || null, ipAddress || null),
			videoId,
		);

		// TODO: add HLS playlist URL to response
		return new GetVideoForViewerDto(video.toPlain());
	}

	async getVideoByIdForEditingOrThrow(videoId: string, channelId: string) {
		const video = await this.getVideoByIdForAuthorOrThrow(videoId, channelId);

		// TODO: Add thumbnails
		return new GetVideoForEditingDto(video.toPlain(), []);
	}

	async getPaginatedVideosByChannelId(
		channelId: string,
		filter: GetVideosForChannelFilterDto,
		pagination: GetVideosForChannelPaginationOptionsDto,
		currentChannelId: string,
	): Promise<PaginatedResponseDto<GetVideoForChannelDto>> {
		const videos = await this.videoRepository.getVideosByChannelId(channelId, filter, pagination);
		const count = await this.videoRepository.getVideosByChannelIdCount(channelId, filter);

		const isAuthor = currentChannelId === channelId;

		return new PaginatedResponseDto(GetVideoForChannelDto.fromArray(videos, isAuthor), pagination, count);
	}

	async editVideoDetailsByIdOrThrow(videoId: string, channelId: string, dto: EditVideoDetailsDto) {
		const video = await this.getVideoByIdForAuthorOrThrow(videoId, channelId);

		if (_.isEmpty(dto.toPlain())) {
			// TODO: Add thumbnails
			return new GetVideoForEditingDto(video.toPlain(), []);
		}

		const updatedVideo = await this.videoRepository.updateVideoById(videoId, dto.toPlain());

		// TODO: Add thumbnails
		return new GetVideoForEditingDto(updatedVideo, []);
	}

	async deleteVideoByIdOrThrow(videoId: string, channelId: string) {
		await this.getVideoByIdForAuthorOrThrow(videoId, channelId);
		await this.videoRepository.deleteVideoById(videoId);
		// TODO: Once video-uploading-api and file-storage are done (i.e. we have the flow of storing files somewhere)
		//  weed to schedule a video deletion job to delete the actual file.
		//  Or maybe Kafka event will work too, idk, need to think about this.
		// TODO: Once search service is done (ElasticSearch), remove the indexed video record from there too.
	}

	private async getChannelById(channelId: string) {
		const response = await this.channelGrpcService.getChannel({ channelId }).toPromise();
		return response?.channel || null;
	}

	private async canAccessNsfw(userId: string) {
		const canAccessNsfwResponse = await this.userGrpcService.canAccessNsfw({ userId }).toPromise();
		return canAccessNsfwResponse?.canAccessNsfw || false;
	}
}
