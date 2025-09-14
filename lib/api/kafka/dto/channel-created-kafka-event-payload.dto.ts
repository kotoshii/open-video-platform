import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { ChannelCreatedKafkaEventPayload } from "~kafka/types/events/channels";

export class ChannelCreatedKafkaEventPayloadDto
	extends BaseKafkaEventPayloadDto
	implements ChannelCreatedKafkaEventPayload
{
	type = KafkaEventTypes.Channels.ChannelCreated;

	constructor(
		channelId: string,
		userId: string,
		name: string,
		description: string | null,
		subscriberCount: string,
		createdDate: Date,
	) {
		super();

		this.channelId = channelId;
		this.userId = userId;
		this.name = name;
		this.description = description;
		this.subscriberCount = subscriberCount;
		this.createdDate = createdDate;
	}

	channelId: string;

	userId: string;

	name: string;

	description: string | null;

	subscriberCount: string;

	createdDate: Date;
}
