import { Inject, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { CommentRateCreatedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/comment-rate-created-kafka-event-payload.dto";
import { CommentRateDeletedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/comment-rate-deleted-kafka-event-payload.dto";
import { CommentRateUpdatedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/comment-rate-updated-kafka-event-payload.dto";
import { KafkaProducerService } from "@ovp-lib/api/kafka/services/kafka-producer.service";
import { SagaBuilder } from "@ovp-lib/common/utils/saga-pattern/saga-builder";
import { COMMENT_SERVICE_NAME, COMMENTS_PACKAGE_NAME, CommentServiceClient } from "@ovp-proto/types/comments";

import { CommentRateType } from "~db/schema";
import { GetCommentRateDto } from "~src/comment-rates/dto/get-comment-rate.dto";
import { UpsertCommentRateDto } from "~src/comment-rates/dto/upsert-comment-rate.dto";
import { CommentRateRepository } from "~src/comment-rates/repositories/comment-rate.repository";

@Injectable()
export class CommentRateService implements OnModuleInit {
	private commentGrpcService: CommentServiceClient;

	constructor(
		@Inject(COMMENTS_PACKAGE_NAME) private commentClientGrpc: ClientGrpc,
		private readonly kafkaProducerService: KafkaProducerService,
		private readonly commentRateRepository: CommentRateRepository,
	) {}

	onModuleInit() {
		this.commentGrpcService = this.commentClientGrpc.getService<CommentServiceClient>(COMMENT_SERVICE_NAME);
	}

	async upsertCommentRateOrThrow(commentId: string, channelId: string, dto: UpsertCommentRateDto) {
		const commentExists = await this.commentExists(commentId);

		if (!commentExists) {
			throw new NotFoundException("Comment not found");
		}

		const { type } = dto;

		const existing = await this.commentRateRepository.getCommentRate(commentId, channelId);

		if (existing) {
			if (existing.type !== type) {
				const sagaResults = await this.updateCommentRateSaga(existing.id, existing.type, type);

				if (sagaResults.error) {
					throw sagaResults.error;
				}

				const commentRate = sagaResults.results?.updateCommentRate || null;

				if (!commentRate) {
					throw new Error(
						`Failed to update comment rate: commentId ${commentId}, channelId ${channelId}, old type ${existing.type}, new type ${type}`,
					);
				}

				return new GetCommentRateDto(commentRate);
			}

			return new GetCommentRateDto(existing);
		}

		const sagaResults = await this.createCommentRateSaga(commentId, channelId, type);

		if (sagaResults.error) {
			throw sagaResults.error;
		}

		const commentRate = sagaResults.results?.createCommentRate || null;

		if (!commentRate) {
			throw new Error(`Failed to create comment rate: commentId ${commentId}, channelId ${channelId}, type ${type}`);
		}

		return new GetCommentRateDto(commentRate);
	}

	async deleteCommentRate(commentId: string, channelId: string) {
		const deleted = await this.commentRateRepository.deleteCommentRate(commentId, channelId);
		if (deleted) {
			await this.kafkaProducerService.emit(
				KafkaTopic.CommentRateEvents,
				new CommentRateDeletedKafkaEventPayloadDto(commentId, deleted.type),
				commentId,
			);
		}
	}

	private async createCommentRateSaga(commentId: string, channelId: string, rateType: CommentRateType) {
		return SagaBuilder.create(`create-comment-rate-comment-${commentId}-type-${rateType}-channel-${channelId}`)
			.addStep(
				"createCommentRate",
				async () => {
					return await this.commentRateRepository.createCommentRate({
						commentId,
						channelId,
						type: rateType,
					});
				},
				async (_, output) => {
					await this.commentRateRepository.deleteCommentRate(output.commentId, output.channelId);
				},
			)
			.addStep(
				"sendCommentRateCreatedKafkaEvent",
				async (input) => {
					await this.kafkaProducerService.emit(
						KafkaTopic.CommentRateEvents,
						new CommentRateCreatedKafkaEventPayloadDto(input.commentId, input.type),
						input.commentId,
					);
				},
				async () => {},
			)
			.execute();
	}

	private async updateCommentRateSaga(rateId: string, oldRateType: CommentRateType, newRateType: CommentRateType) {
		return SagaBuilder.create(`update-comment-rate-${rateId}-oldType-${oldRateType}-newType-${newRateType}`)
			.addStep(
				"updateCommentRate",
				async () => {
					return this.commentRateRepository.updateCommentRateById(rateId, { type: newRateType });
				},
				async (_, output) => {
					await this.commentRateRepository.updateCommentRateById(output.id, { type: oldRateType });
				},
			)
			.addStep(
				"sendCommentRateUpdatedKafkaEvent",
				async (input) => {
					await this.kafkaProducerService.emit(
						KafkaTopic.CommentRateEvents,
						new CommentRateUpdatedKafkaEventPayloadDto(input.commentId, oldRateType, newRateType),
						input.commentId,
					);
				},
				async () => {},
			)
			.execute();
	}

	private async commentExists(commentId: string) {
		const response = await this.commentGrpcService.commentExists({ commentId }).toPromise();
		return response?.exists || false;
	}
}
