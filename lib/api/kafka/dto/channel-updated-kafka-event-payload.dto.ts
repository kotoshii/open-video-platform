import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { ChannelUpdatedKafkaEventPayload } from "~kafka/types/events/channels";

export class ChannelUpdatedKafkaEventPayloadDto
	extends BaseKafkaEventPayloadDto
	implements ChannelUpdatedKafkaEventPayload
{
	type = KafkaEventTypes.Channels.ChannelUpdated;

	constructor(channelId: string, name: string, description: string | null) {
		super();

		this.channelId = channelId;
		this.name = name;
		this.description = description;
	}

	channelId: string;

	name: string;

	description: string | null;
}
