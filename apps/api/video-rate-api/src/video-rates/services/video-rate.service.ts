import { ForbiddenException, Inject, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { VideoRateCreatedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/video-rate-created-kafka-event-payload.dto";
import { VideoRateDeletedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/video-rate-deleted-kafka-event-payload.dto";
import { VideoRateUpdatedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/video-rate-updated-kafka-event-payload.dto";
import { KafkaProducerService } from "@ovp-lib/api/kafka/services/kafka-producer.service";
import { SagaBuilder } from "@ovp-lib/common/utils/saga-pattern/saga-builder";
import { VIDEO_SERVICE_NAME, VIDEOS_PACKAGE_NAME, VideoServiceClient } from "@ovp-proto/types/videos";

import { VideoRateType } from "~db/schema";
import { GetVideoRateDto } from "~src/video-rates/dto/get-video-rate.dto";
import { UpsertVideoRateDto } from "~src/video-rates/dto/upsert-video-rate.dto";
import { VideoRateRepository } from "~src/video-rates/repositories/video-rate.repository";

@Injectable()
export class VideoRateService implements OnModuleInit {
	private videoGrpcService: VideoServiceClient;

	constructor(
		@Inject(VIDEOS_PACKAGE_NAME) private videoClientGrpc: ClientGrpc,

		private readonly kafkaProducerService: KafkaProducerService,
		private readonly videoRateRepository: VideoRateRepository,
	) {}

	onModuleInit() {
		this.videoGrpcService = this.videoClientGrpc.getService<VideoServiceClient>(VIDEO_SERVICE_NAME);
	}

	async upsertVideoRateOrThrow(videoId: string, userId: string, channelId: string, dto: UpsertVideoRateDto) {
		const video = await this.getVideo(videoId, userId, channelId);

		if (!video) {
			throw new NotFoundException("Video not found");
		}

		if (!video.allowRates) {
			throw new ForbiddenException("Rates are disabled for the requested video");
		}

		const { type } = dto;

		const existing = await this.videoRateRepository.getVideoRate(videoId, channelId);

		if (existing) {
			if (existing.type !== type) {
				const sagaResults = await this.updateVideoRateSaga(existing.id, existing.type, type);

				if (sagaResults.error) {
					throw sagaResults.error;
				}

				const videoRate = sagaResults.results?.updateVideoRate || null;

				if (!videoRate) {
					throw new Error(
						`Failed to update video rate: videoId ${videoId}, channelId ${channelId}, old type ${existing.type}, new type ${type}`,
					);
				}

				return new GetVideoRateDto(videoRate);
			}

			return new GetVideoRateDto(existing);
		}

		const sagaResults = await this.createVideoRateSaga(videoId, channelId, type);

		if (sagaResults.error) {
			throw sagaResults.error;
		}

		const videoRate = sagaResults.results?.createVideoRate || null;

		if (!videoRate) {
			throw new Error(`Failed to create video rate: videoId ${videoId}, channelId ${channelId}, type ${type}`);
		}

		return new GetVideoRateDto(videoRate);
	}

	async getVideoRateOrThrow(videoId: string, channelId: string) {
		const videoRate = await this.videoRateRepository.getVideoRate(videoId, channelId);

		if (!videoRate) {
			throw new NotFoundException("Video rate not found");
		}

		return new GetVideoRateDto(videoRate);
	}

	async deleteVideoRate(videoId: string, channelId: string) {
		const deleted = await this.videoRateRepository.deleteVideoRate(videoId, channelId);
		if (deleted) {
			await this.kafkaProducerService.emit(
				KafkaTopic.VideoRateEvents,
				new VideoRateDeletedKafkaEventPayloadDto(videoId, deleted.type),
				videoId,
			);
		}
	}

	private async createVideoRateSaga(videoId: string, channelId: string, rateType: VideoRateType) {
		return SagaBuilder.create(`create-video-rate-video-${videoId}-type-${rateType}-channel-${channelId}`)
			.addStep(
				"createVideoRate",
				async () => {
					return await this.videoRateRepository.createVideoRate({
						videoId,
						channelId,
						type: rateType,
					});
				},
				async (_, output) => {
					await this.videoRateRepository.deleteVideoRate(output.videoId, output.channelId);
				},
			)
			.addStep(
				"sendVideoRateCreatedKafkaEvent",
				async (input) => {
					await this.kafkaProducerService.emit(
						KafkaTopic.VideoRateEvents,
						new VideoRateCreatedKafkaEventPayloadDto(input.videoId, input.type),
						input.videoId,
					);
				},
				async () => {},
			)
			.execute();
	}

	private async updateVideoRateSaga(rateId: string, oldRateType: VideoRateType, newRateType: VideoRateType) {
		return SagaBuilder.create(`update-video-rate-${rateId}-oldType-${oldRateType}-newType-${newRateType}`)
			.addStep(
				"updateVideoRate",
				async () => {
					return this.videoRateRepository.updateVideoRateById(rateId, { type: newRateType });
				},
				async (_, output) => {
					await this.videoRateRepository.updateVideoRateById(output.id, { type: oldRateType });
				},
			)
			.addStep(
				"sendVideoRateUpdatedKafkaEvent",
				async (input) => {
					await this.kafkaProducerService.emit(
						KafkaTopic.VideoRateEvents,
						new VideoRateUpdatedKafkaEventPayloadDto(input.videoId, oldRateType, newRateType),
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
}
