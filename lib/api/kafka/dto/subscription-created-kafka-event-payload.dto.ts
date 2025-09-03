import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { SubscriptionCreatedKafkaEventPayload } from "~kafka/types/events/subscriptions";

export class SubscriptionCreatedKafkaEventPayloadDto extends BaseKafkaEventPayloadDto {
	static readonly EventType = KafkaEventTypes.Subscriptions.SubscriptionCreated;

	static createPayload(subscriberId: string, channelId: string): SubscriptionCreatedKafkaEventPayload {
		return SubscriptionCreatedKafkaEventPayloadDto.buildPayload({
			subscriberId,
			channelId,
		});
	}
}
