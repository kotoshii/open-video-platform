import { KafkaTopic } from "~kafka/constants/topic-names";

export interface SubscriptionDeletedKafkaPayload {
	subscriberChannelId: string;
	subscribedChannelId: string;
}

export class SubscriptionDeletedKafkaPayloadDto {
	static readonly Topic = KafkaTopic.SubscriptionDeleted;

	static createPayload(subscriberChannelId: string, subscribedChannelId: string): SubscriptionDeletedKafkaPayload {
		return {
			subscriberChannelId,
			subscribedChannelId,
		};
	}
}
