import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { SubscriptionDeletedKafkaEventPayload } from "~kafka/types/events/subscriptions";

export class SubscriptionDeletedKafkaEventPayloadDto extends BaseKafkaEventPayloadDto {
	static readonly EventType = KafkaEventTypes.Subscriptions.SubscriptionDeleted;

	static createPayload(subscriberId: string, channelId: string): SubscriptionDeletedKafkaEventPayload {
		return SubscriptionDeletedKafkaEventPayloadDto.buildPayload({ subscriberId, channelId });
	}
}
