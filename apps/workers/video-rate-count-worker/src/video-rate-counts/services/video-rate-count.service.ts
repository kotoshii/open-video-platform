import { Injectable } from "@nestjs/common";
import { KafkaEventTypes } from "@ovp-lib/api/kafka/constants/event-types";
import { KafkaDeduplicationService } from "@ovp-lib/api/kafka/services/kafka-deduplication.service";
import { VideoRateKafkaEventPayload, VideoRateType } from "@ovp-lib/api/kafka/types/events/video-rates";
import { BaseCountWorkerService } from "@ovp-lib/workers/counts/services/base-count-worker.service";
import { KafkaEventPayloadWithOffset } from "@ovp-lib/workers/counts/types/kafka-event-payload-with-offset";
import { EachBatchPayload } from "kafkajs";

import { VideoService } from "~src/videos/services/video.service";

@Injectable()
export class VideoRateCountService extends BaseCountWorkerService<VideoRateKafkaEventPayload> {
	constructor(
		deduplicationService: KafkaDeduplicationService,
		private readonly videoService: VideoService,
	) {
		super(deduplicationService);
	}

	async handleEvents(payload: EachBatchPayload) {
		try {
			const events = await this.deduplicateEvents(payload);
			const { videoIds, rateTypes, deltas } = this.calculateVideoRateCountDeltas(events);

			try {
				await this.videoService.updateRateCounts(videoIds, rateTypes, deltas);
			} catch (e) {
				this.logger.error(`Failed to update video rate counts: ${e}`);
				return;
			}

			await this.resolveOffsets(payload, events);
		} catch (e) {
			this.logger.error(`Error in "${payload.batch.topic}" topic handler: ${e}`);
			return;
		}
	}

	private calculateVideoRateCountDeltas(events: KafkaEventPayloadWithOffset<VideoRateKafkaEventPayload>[]) {
		const likeDeltas = new Map<string, number>();
		const dislikeDeltas = new Map<string, number>();

		const maps = { like: likeDeltas, dislike: dislikeDeltas };

		for (const event of events) {
			const payload = event.payload;
			const { videoId, type } = payload;

			if (type === KafkaEventTypes.VideoRates.VideoRateCreated) {
				const { rateType } = payload;
				const map = maps[rateType];

				let delta = map.get(videoId) || 0;
				delta += 1;

				map.set(videoId, delta);
			}

			if (type === KafkaEventTypes.VideoRates.VideoRateDeleted) {
				const { rateType } = payload;
				const map = maps[rateType];

				let delta = map.get(videoId) || 0;
				delta -= 1;

				map.set(videoId, delta);
			}

			if (type === KafkaEventTypes.VideoRates.VideoRateUpdated) {
				const { oldRateType, newRateType } = payload;

				const oldMap = maps[oldRateType];
				const newMap = maps[newRateType];

				let oldDelta = oldMap.get(videoId) || 0;
				let newDelta = newMap.get(videoId) || 0;

				oldDelta -= 1;
				newDelta += 1;

				oldMap.set(videoId, oldDelta);
				newMap.set(videoId, newDelta);
			}
		}

		return {
			videoIds: [...likeDeltas.keys(), ...dislikeDeltas.keys()],
			rateTypes: [
				...Array.from({ length: likeDeltas.size }, () => "like"),
				...Array.from({ length: dislikeDeltas.size }, () => "dislike"),
			] as VideoRateType[],
			deltas: [...likeDeltas.values(), ...dislikeDeltas.values()],
		};
	}
}
