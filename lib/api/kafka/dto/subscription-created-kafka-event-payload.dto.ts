import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { SubscriptionCreatedKafkaEventPayload } from "~kafka/types/events/subscriptions";

export class SubscriptionCreatedKafkaEventPayloadDto
	extends BaseKafkaEventPayloadDto
	implements SubscriptionCreatedKafkaEventPayload
{
	type = KafkaEventTypes.Subscriptions.SubscriptionCreated;

	constructor(subscriberId: string, channelId: string) {
		super();

		this.subscriberId = subscriberId;
		this.channelId = channelId;
	}

	subscriberId: string;

	channelId: string;
}
