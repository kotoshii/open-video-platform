import { Injectable } from "@nestjs/common";
import { KafkaEventTypes } from "@ovp-lib/api/kafka/constants/event-types";
import { KafkaDeduplicationService } from "@ovp-lib/api/kafka/services/kafka-deduplication.service";
import { SubscriptionKafkaEventPayload } from "@ovp-lib/api/kafka/types/events/subscriptions";
import { BaseCountWorkerService } from "@ovp-lib/workers/counts/services/base-count-worker.service";
import { KafkaEventPayloadWithOffset } from "@ovp-lib/workers/counts/types/kafka-event-payload-with-offset";
import { EachBatchPayload } from "kafkajs";

import { ChannelService } from "~src/channels/services/channel.service";

@Injectable()
export class SubscriberCountService extends BaseCountWorkerService<SubscriptionKafkaEventPayload> {
	constructor(
		deduplicationService: KafkaDeduplicationService,
		private readonly channelService: ChannelService,
	) {
		super(deduplicationService);
	}

	async handleEvents(payload: EachBatchPayload) {
		try {
			const events = await this.deduplicateEvents(payload);
			const { channelIds, deltas } = this.calculateSubscriberCountDeltas(events);

			try {
				await this.channelService.updateSubscriberCounts(channelIds, deltas);
			} catch (e) {
				this.logger.error(`Failed to update subscriber counts: ${e}`);
				return;
			}

			await this.resolveOffsets(payload, events);
		} catch (e) {
			this.logger.error(`Error in "${payload.batch.topic}" topic handler: ${e}`);
			return;
		}
	}

	private calculateSubscriberCountDeltas(events: KafkaEventPayloadWithOffset<SubscriptionKafkaEventPayload>[]) {
		const deltas = new Map<string, number>();

		for (const event of events) {
			const payload = event.payload;
			let delta = deltas.get(payload.channelId) || 0;

			if (payload.type === KafkaEventTypes.Subscriptions.SubscriptionCreated) {
				delta += 1;
			} else if (payload.type === KafkaEventTypes.Subscriptions.SubscriptionDeleted) {
				delta -= 1;
			}

			deltas.set(payload.channelId, delta);
		}

		return { channelIds: [...deltas.keys()], deltas: [...deltas.values()] };
	}
}
