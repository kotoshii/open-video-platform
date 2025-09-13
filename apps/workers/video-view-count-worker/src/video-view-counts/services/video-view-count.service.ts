import { Injectable } from "@nestjs/common";
import { KafkaEventTypes } from "@ovp-lib/api/kafka/constants/event-types";
import { KafkaDeduplicationService } from "@ovp-lib/api/kafka/services/kafka-deduplication.service";
import { VideoKafkaEventPayload } from "@ovp-lib/api/kafka/types/events/videos";
import { BaseCountWorkerService } from "@ovp-lib/workers/counts/services/base-count-worker.service";
import { KafkaEventPayloadWithOffset } from "@ovp-lib/workers/counts/types/kafka-event-payload-with-offset";
import { EachBatchPayload } from "kafkajs";

import { ViewsDeduplicationService } from "~src/video-view-counts/services/views-deduplication.service";
import { VideoService } from "~src/videos/services/video.service";

@Injectable()
export class VideoViewCountService extends BaseCountWorkerService<VideoKafkaEventPayload> {
	constructor(
		deduplicationService: KafkaDeduplicationService,
		private readonly viewsDeduplicationService: ViewsDeduplicationService,
		private readonly videoService: VideoService,
	) {
		super(deduplicationService);
	}

	async handleEvents(payload: EachBatchPayload) {
		try {
			const events = await this.deduplicateEvents(payload);

			const newViewEvents = await this.viewsDeduplicationService.getNewViewEvents(events);
			const { videoIds, deltas } = this.calculateViewCountDeltas(newViewEvents);

			try {
				await this.videoService.updateViewCounts(videoIds, deltas);
			} catch (e) {
				this.logger.error(`Failed to update videos view counts: ${e}`);
				return;
			}

			await this.resolveOffsets(payload, events);
		} catch (e) {
			this.logger.error(`Error in "${payload.batch.topic}" topic handler: ${e}`);
			return;
		}
	}

	private calculateViewCountDeltas(events: KafkaEventPayloadWithOffset<VideoKafkaEventPayload>[]) {
		const deltas = new Map<string, number>();

		for (const event of events) {
			const payload = event.payload;
			let delta = deltas.get(payload.videoId) || 0;

			if (payload.type === KafkaEventTypes.Videos.VideoViewed) {
				delta += 1;
			}

			deltas.set(payload.videoId, delta);
		}

		return { videoIds: [...deltas.keys()], deltas: [...deltas.values()] };
	}
}
