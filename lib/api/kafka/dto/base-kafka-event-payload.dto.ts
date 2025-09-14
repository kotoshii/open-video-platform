import { ulid } from "ulid";

import { BaseKafkaEventPayload } from "~kafka/types/events/base-kafka-event-payload";

export abstract class BaseKafkaEventPayloadDto implements BaseKafkaEventPayload {
	eventId: string = ulid();

	abstract type: string;

	timestamp: number = Date.now();
}
