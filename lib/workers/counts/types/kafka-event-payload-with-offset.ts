import { BaseKafkaEventPayload } from "@ovp-lib/api/kafka/types/events/base-kafka-event-payload";

export interface KafkaEventPayloadWithOffset<TPayload extends BaseKafkaEventPayload> {
	offset: string;
	payload: TPayload;
}
