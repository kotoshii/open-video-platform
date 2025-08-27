import { KafkaTopic } from "~kafka/constants/topic-names";

export interface SubscriptionCreatedKafkaPayload {
	subscriberChannelId: string;
	subscribedChannelId: string;
}

export class SubscriptionCreatedKafkaPayloadDto {
	static readonly Topic = KafkaTopic.SubscriptionCreated;

	static createPayload(subscriberChannelId: string, subscribedChannelId: string): SubscriptionCreatedKafkaPayload {
		return {
			subscriberChannelId,
			subscribedChannelId,
		};
	}
}
