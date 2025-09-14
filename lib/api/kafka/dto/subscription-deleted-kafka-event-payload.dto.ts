import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { SubscriptionDeletedKafkaEventPayload } from "~kafka/types/events/subscriptions";

export class SubscriptionDeletedKafkaEventPayloadDto
	extends BaseKafkaEventPayloadDto
	implements SubscriptionDeletedKafkaEventPayload
{
	type = KafkaEventTypes.Subscriptions.SubscriptionDeleted;

	constructor(subscriberId: string, channelId: string) {
		super();

		this.subscriberId = subscriberId;
		this.channelId = channelId;
	}

	subscriberId: string;

	channelId: string;
}
