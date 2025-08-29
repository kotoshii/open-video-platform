import { IsNotEmpty, IsString, IsUUID } from "class-validator";

import { KafkaEventTypes } from "~kafka/constants/event-types";
import { KafkaTopic } from "~kafka/constants/topic-names";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { SubscriptionCreatedKafkaEventPayload } from "~kafka/types/events/subscriptions";

export class SubscriptionCreatedKafkaEventPayloadDto extends BaseKafkaEventPayloadDto {
	static readonly Topic = KafkaTopic.SubscriptionEvents;
	static readonly EventType = KafkaEventTypes.Subscriptions.SubscriptionCreated;

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	subscriberId: string;

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	channelId: string;

	static createPayload(subscriberId: string, channelId: string): SubscriptionCreatedKafkaEventPayload {
		return SubscriptionCreatedKafkaEventPayloadDto.buildPayload({
			subscriberId,
			channelId,
		});
	}
}
