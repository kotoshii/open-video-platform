import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayload } from "~kafka/types/events/base-kafka-event-payload";

export interface SubscriptionCreatedKafkaEventPayload extends BaseKafkaEventPayload {
	type: typeof KafkaEventTypes.Subscriptions.SubscriptionCreated;
	subscriberId: string;
	channelId: string;
}

export interface SubscriptionDeletedKafkaEventPayload extends BaseKafkaEventPayload {
	type: typeof KafkaEventTypes.Subscriptions.SubscriptionDeleted;
	subscriberId: string;
	channelId: string;
}
