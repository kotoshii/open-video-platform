import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { ChannelUpdatedKafkaEventPayload } from "~kafka/types/events/channels";

export class ChannelUpdatedKafkaEventPayloadDto extends BaseKafkaEventPayloadDto {
	static readonly EventType = KafkaEventTypes.Channels.ChannelUpdated;

	static createPayload(channelId: string, name: string, description: string | null): ChannelUpdatedKafkaEventPayload {
		return ChannelUpdatedKafkaEventPayloadDto.buildPayload({
			channelId,
			name,
			description,
		});
	}
}
