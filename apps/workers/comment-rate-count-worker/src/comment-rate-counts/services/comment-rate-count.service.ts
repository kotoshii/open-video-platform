import { Injectable } from "@nestjs/common";
import { KafkaEventTypes } from "@ovp-lib/api/kafka/constants/event-types";
import { KafkaDeduplicationService } from "@ovp-lib/api/kafka/services/kafka-deduplication.service";
import { CommentRateKafkaEventPayload, CommentRateType } from "@ovp-lib/api/kafka/types/events/comment-rates";
import { BaseCountWorkerService } from "@ovp-lib/workers/counts/services/base-count-worker.service";
import { KafkaEventPayloadWithOffset } from "@ovp-lib/workers/counts/types/kafka-event-payload-with-offset";
import { EachBatchPayload } from "kafkajs";

import { CommentService } from "~src/comments/services/comment.service";

@Injectable()
export class CommentRateCountService extends BaseCountWorkerService<CommentRateKafkaEventPayload> {
	constructor(
		deduplicationService: KafkaDeduplicationService,
		private readonly commentService: CommentService,
	) {
		super(deduplicationService);
	}

	async handleEvents(payload: EachBatchPayload) {
		try {
			const events = await this.deduplicateEvents(payload);
			const { commentIds, rateTypes, deltas } = this.calculateCommentRateCountDeltas(events);

			try {
				await this.commentService.updateRateCounts(commentIds, rateTypes, deltas);
			} catch (e) {
				this.logger.error(`Failed to update comment rate counts: ${e}`);
				return;
			}

			await this.resolveOffsets(payload, events);
		} catch (e) {
			this.logger.error(`Error in "${payload.batch.topic}" topic handler: ${e}`);
			return;
		}
	}

	private calculateCommentRateCountDeltas(events: KafkaEventPayloadWithOffset<CommentRateKafkaEventPayload>[]) {
		const likeDeltas = new Map<string, number>();
		const dislikeDeltas = new Map<string, number>();

		const maps = { like: likeDeltas, dislike: dislikeDeltas };

		for (const event of events) {
			const payload = event.payload;
			const { commentId, type } = payload;

			if (type === KafkaEventTypes.CommentRates.CommentRateCreated) {
				const { rateType } = payload;
				const map = maps[rateType];

				let delta = map.get(commentId) || 0;
				delta += 1;

				map.set(commentId, delta);
			}

			if (type === KafkaEventTypes.CommentRates.CommentRateDeleted) {
				const { rateType } = payload;
				const map = maps[rateType];

				let delta = map.get(commentId) || 0;
				delta -= 1;

				map.set(commentId, delta);
			}

			if (type === KafkaEventTypes.CommentRates.CommentRateUpdated) {
				const { oldRateType, newRateType } = payload;

				const oldMap = maps[oldRateType];
				const newMap = maps[newRateType];

				let oldDelta = oldMap.get(commentId) || 0;
				let newDelta = newMap.get(commentId) || 0;

				oldDelta -= 1;
				newDelta += 1;

				oldMap.set(commentId, oldDelta);
				newMap.set(commentId, newDelta);
			}
		}

		return {
			commentIds: [...likeDeltas.keys(), ...dislikeDeltas.keys()],
			rateTypes: [
				...Array.from({ length: likeDeltas.size }, () => "like"),
				...Array.from({ length: dislikeDeltas.size }, () => "dislike"),
			] as CommentRateType[],
			deltas: [...likeDeltas.values(), ...dislikeDeltas.values()],
		};
	}
}
