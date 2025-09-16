import { Injectable } from "@nestjs/common";
import { KafkaEventTypes } from "@ovp-lib/api/kafka/constants/event-types";
import { KafkaDeduplicationService } from "@ovp-lib/api/kafka/services/kafka-deduplication.service";
import { CommentKafkaEventPayload } from "@ovp-lib/api/kafka/types/events/comments";
import { BaseCountWorkerService } from "@ovp-lib/workers/counts/services/base-count-worker.service";
import { KafkaEventPayloadWithOffset } from "@ovp-lib/workers/counts/types/kafka-event-payload-with-offset";
import { EachBatchPayload } from "kafkajs";

import { VideoService } from "~src/videos/services/video.service";

@Injectable()
export class VideoCommentCountService extends BaseCountWorkerService<CommentKafkaEventPayload> {
	constructor(
		deduplicationService: KafkaDeduplicationService,
		private readonly videoService: VideoService,
	) {
		super(deduplicationService);
	}

	async handleEvents(payload: EachBatchPayload) {
		try {
			const events = await this.deduplicateEvents(payload);
			const { videoIds, deltas } = this.calculateVideoCommentCountDeltas(events);

			try {
				await this.videoService.updateCommentCounts(videoIds, deltas);
			} catch (e) {
				this.logger.error(`Failed to update video comment counts: ${e}`);
				return;
			}

			await this.resolveOffsets(payload, events);
		} catch (e) {
			this.logger.error(`Error in "${payload.batch.topic}" topic handler: ${e}`);
			return;
		}
	}

	private calculateVideoCommentCountDeltas(events: KafkaEventPayloadWithOffset<CommentKafkaEventPayload>[]) {
		const deltas = new Map<string, number>();

		for (const event of events) {
			const payload = event.payload;
			let delta = deltas.get(payload.videoId) || 0;

			if (payload.type === KafkaEventTypes.Comments.CommentCreated) {
				delta += 1;
			} else if (payload.type === KafkaEventTypes.Comments.CommentDeleted) {
				delta -= 1;
			}

			deltas.set(payload.videoId, delta);
		}

		return { videoIds: [...deltas.keys()], deltas: [...deltas.values()] };
	}
}
