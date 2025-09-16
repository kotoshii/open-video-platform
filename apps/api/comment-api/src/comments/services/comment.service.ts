import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
	OnModuleInit,
} from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { KafkaEventTypes } from "@ovp-lib/api/kafka/constants/event-types";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { CommentCreatedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/comment-created-kafka-event-payload.dto";
import { CommentDeletedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/comment-deleted-kafka-event-payload.dto";
import { KafkaProducerService } from "@ovp-lib/api/kafka/services/kafka-producer.service";
import { ChannelKafkaEventPayload } from "@ovp-lib/api/kafka/types/events/channels";
import { jsonParseOrNull } from "@ovp-lib/common/utils/json";
import { SagaBuilder } from "@ovp-lib/common/utils/saga-pattern/saga-builder";
import { CHANNEL_SERVICE_NAME, CHANNELS_PACKAGE_NAME, ChannelServiceClient } from "@ovp-proto/types/channels";
import { VIDEO_SERVICE_NAME, VIDEOS_PACKAGE_NAME, VideoServiceClient } from "@ovp-proto/types/videos";
import { EachMessagePayload } from "kafkajs";

import { CreateCommentDto } from "~src/comments/dto/create-comment.dto";
import { GetCommentDto } from "~src/comments/dto/get-comment.dto";
import { UpdateCommentDto } from "~src/comments/dto/update-comment.dto";
import { CommentRepository } from "~src/comments/repositories/comment.repository";

@Injectable()
export class CommentService implements OnModuleInit {
	private readonly logger = new Logger(CommentService.name);

	private videoGrpcService: VideoServiceClient;
	private channelGrpcService: ChannelServiceClient;

	constructor(
		@Inject(VIDEOS_PACKAGE_NAME) private videoClientGrpc: ClientGrpc,
		@Inject(CHANNELS_PACKAGE_NAME) private channelClientGrpc: ClientGrpc,

		private readonly kafkaProducerService: KafkaProducerService,
		private readonly commentRepository: CommentRepository,
	) {}

	onModuleInit() {
		this.videoGrpcService = this.videoClientGrpc.getService<VideoServiceClient>(VIDEO_SERVICE_NAME);
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
				await this.commentRepository.updateCommentsByChannelId(message.channelId, {
					channelName: message.name,
				});
			}

			await payload.heartbeat();
		} catch (e) {
			this.logger.error(`Error in "${KafkaTopic.ChannelEvents}" topic handler: ${e}`);
			throw e;
		}
	}

	async createCommentOrThrow(userId: string, channelId: string, videoId: string, dto: CreateCommentDto) {
		const { parentId, content } = dto;

		if (parentId) {
			const parent = await this.commentRepository.getCommentById(parentId);

			if (!parent) {
				throw new NotFoundException("Parent comment not found");
			}

			if (parent.parentId) {
				throw new BadRequestException("Failed to create comment: cannot post reply to another reply");
			}
		}

		const video = await this.getVideo(videoId, userId, channelId);

		if (!video) {
			throw new NotFoundException("Video not found");
		}

		if (!video.allowComments) {
			throw new ForbiddenException("Comments are disabled for the requested video");
		}

		const channel = await this.getChannel(channelId);

		if (!channel) {
			throw new NotFoundException("Channel not found");
		}

		const sagaResults = await this.createCommentSaga(videoId, channelId, channel.name, content, parentId);

		if (sagaResults.error) {
			throw sagaResults.error;
		}

		const comment = sagaResults.results?.createComment || null;

		if (!comment) {
			throw new Error(`Failed to create comment: videoId ${videoId}, channelId ${channelId}, parentId ${parentId}`);
		}

		return new GetCommentDto(comment);
	}

	async getCommentById(commentId: string) {
		const comment = await this.commentRepository.getCommentById(commentId);
		return comment ? new GetCommentDto(comment) : null;
	}

	async getCommentByIdForAuthorOrThrow(commentId: string, authorId: string) {
		const comment = await this.commentRepository.getCommentById(commentId);

		if (!comment) {
			throw new NotFoundException("Comment not found");
		}

		if (comment.channelId !== authorId) {
			throw new ForbiddenException("You do not have permissions to view this content");
		}

		return new GetCommentDto(comment);
	}

	async updateCommentByIdOrThrow(channelId: string, commentId: string, dto: UpdateCommentDto) {
		const comment = await this.getCommentByIdForAuthorOrThrow(commentId, channelId);
		const updatedComment = await this.commentRepository.updateCommentById(comment.id, dto.toPlain());

		return new GetCommentDto(updatedComment);
	}

	async deleteCommentByIdOrThrow(channelId: string, commentId: string) {
		const comment = await this.getCommentByIdForAuthorOrThrow(commentId, channelId);
		const deleted = await this.commentRepository.deleteCommentById(comment.id);

		if (deleted) {
			await this.kafkaProducerService.emit(
				KafkaTopic.CommentEvents,
				new CommentDeletedKafkaEventPayloadDto(comment.videoId),
				comment.videoId,
			);
		}
	}

	private async createCommentSaga(
		videoId: string,
		channelId: string,
		channelName: string,
		content: string,
		parentId: string | undefined,
	) {
		return SagaBuilder.create(`create-comment-video-${videoId}-author-${channelId}`)
			.addStep(
				"createComment",
				async () => {
					return await this.commentRepository.createComment({
						videoId,
						channelId,
						channelName,
						content,
						parentId,
					});
				},
				async (_, output) => {
					await this.commentRepository.deleteCommentById(output.id);
				},
			)
			.addStep(
				"sendCommentCreatedKafkaEvent",
				async (input) => {
					await this.kafkaProducerService.emit(
						KafkaTopic.CommentEvents,
						new CommentCreatedKafkaEventPayloadDto(input.videoId),
						input.videoId,
					);
				},
				async () => {},
			)
			.execute();
	}

	private async getVideo(videoId: string, userId: string, channelId: string) {
		const videoResponse = await this.videoGrpcService.getVideo({ videoId, userId, channelId }).toPromise();
		return videoResponse?.video || null;
	}

	private async getChannel(channelId: string) {
		const channelResponse = await this.channelGrpcService.getChannel({ channelId }).toPromise();
		return channelResponse?.channel || null;
	}
}
