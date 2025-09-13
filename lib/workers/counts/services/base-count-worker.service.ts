import { Logger } from "@nestjs/common";
import { KafkaDeduplicationService } from "@ovp-lib/api/kafka/services/kafka-deduplication.service";
import { BaseKafkaEventPayload } from "@ovp-lib/api/kafka/types/events/base-kafka-event-payload";
import { jsonParseOrNull } from "@ovp-lib/common/utils/json";
import { EachBatchPayload } from "kafkajs";

import { KafkaEventPayloadWithOffset } from "~counts/types/kafka-event-payload-with-offset";

export abstract class BaseCountWorkerService<TPayload extends BaseKafkaEventPayload> {
	protected readonly logger = new Logger(this.constructor.name);

	protected constructor(private readonly deduplicationService: KafkaDeduplicationService) {}

	protected async deduplicateEvents(payload: EachBatchPayload): Promise<KafkaEventPayloadWithOffset<TPayload>[]> {
		const { batch, isStale, isRunning } = payload;

		if (isStale() || !isRunning()) {
			return [];
		}

		const allEvents = batch.messages
			.map<KafkaEventPayloadWithOffset<TPayload> | null>((message) => {
				const payload = message.value ? jsonParseOrNull<TPayload>(message.value.toString()) : null;
				if (payload) {
					return { offset: message.offset, payload };
				}
				return null;
			})
			.filter((event) => event !== null);

		const allEventIds = allEvents.map((event) => event.payload.eventId);

		try {
			const newEventIds = new Set(await this.deduplicationService.reserveEventIds(allEventIds));
			return allEvents.filter((event) => newEventIds.has(event.payload.eventId));
		} catch (e) {
			this.logger.error(`Failed to reserve event IDs: ${e}`);
			return [];
		}
	}

	protected async resolveOffsets(payload: EachBatchPayload, events: KafkaEventPayloadWithOffset<TPayload>[]) {
		const { resolveOffset, commitOffsetsIfNecessary, heartbeat } = payload;

		for (const event of events) {
			resolveOffset(event.offset);
		}
		await commitOffsetsIfNecessary();
		await heartbeat();
	}

	abstract handleEvents(payload: EachBatchPayload): Promise<void>;
}
