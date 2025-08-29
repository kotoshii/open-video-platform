import { IsNotEmpty, IsString, IsUUID } from "class-validator";

import { KafkaEventTypes } from "~kafka/constants/event-types";
import { KafkaTopic } from "~kafka/constants/topic-names";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { SubscriptionDeletedKafkaEventPayload } from "~kafka/types/events/subscriptions";

export class SubscriptionDeletedKafkaEventPayloadDto extends BaseKafkaEventPayloadDto {
	static readonly Topic = KafkaTopic.SubscriptionEvents;
	static readonly EventType = KafkaEventTypes.Subscriptions.SubscriptionDeleted;

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	subscriberId: string;

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	channelId: string;

	static createPayload(subscriberId: string, channelId: string): SubscriptionDeletedKafkaEventPayload {
		return SubscriptionDeletedKafkaEventPayloadDto.buildPayload({ subscriberId, channelId });
	}
}
