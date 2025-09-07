import { Injectable, Logger } from "@nestjs/common";
import { KafkaEventTypes } from "@ovp-lib/api/kafka/constants/event-types";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { KafkaDeduplicationService } from "@ovp-lib/api/kafka/services/kafka-deduplication.service";
import { SubscriptionKafkaEventPayload } from "@ovp-lib/api/kafka/types/events/subscriptions";
import { jsonParseOrNull } from "@ovp-lib/common/utils/json";
import { EachBatchPayload } from "kafkajs";

import { ChannelService } from "~src/channels/services/channel.service";

@Injectable()
export class SubscriberCountService {
	private readonly logger = new Logger(SubscriberCountService.name);

	constructor(
		private readonly deduplicationService: KafkaDeduplicationService,
		private readonly channelService: ChannelService,
	) {}

	async handleSubscriptionEvents(payload: EachBatchPayload) {
		try {
			const { batch, isStale, isRunning, commitOffsetsIfNecessary, resolveOffset, heartbeat } = payload;

			if (isStale() || !isRunning()) {
				return;
			}

			const events = batch.messages
				.map((message) => {
					const payload = message.value
						? jsonParseOrNull<SubscriptionKafkaEventPayload>(message.value.toString())
						: null;
					if (payload) {
						return { offset: message.offset, payload };
					}
					return null;
				})
				.filter((event) => event !== null);
			const eventIds = events.map((event) => event.payload.eventId);

			let newEventIds: string[] = [];

			try {
				newEventIds = await this.deduplicationService.reserveEventIds(eventIds);
			} catch (e) {
				this.logger.error(`Failed to reserve event IDs: ${e}`);
				return;
			}

			const newEventIdsMap = new Map(newEventIds.map((eventId) => [eventId, 0]));

			const newEvents = events.filter((event) => newEventIdsMap.has(event.payload.eventId));
			const newEventPayloads = newEvents.map((event) => event.payload);

			const { channelIds, deltas } = this.calculateSubscriberCountDeltas(newEventPayloads);

			try {
				await this.channelService.updateSubscriberCounts(channelIds, deltas);
			} catch (e) {
				this.logger.error(`Failed to update subscriber counts: ${e}`);
				return;
			}

			for (const event of events) {
				resolveOffset(event.offset);
			}
			await commitOffsetsIfNecessary();
			await heartbeat();
		} catch (e) {
			this.logger.error(`Error in "${KafkaTopic.SubscriptionEvents}" topic handler: ${e}`);
			return;
		}
	}

	private calculateSubscriberCountDeltas(payloads: SubscriptionKafkaEventPayload[]) {
		const deltas = new Map<string, number>();

		for (const payload of payloads) {
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
