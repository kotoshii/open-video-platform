import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { ChannelCreatedKafkaEventPayload } from "~kafka/types/events/channels";

export class ChannelCreatedKafkaEventPayloadDto extends BaseKafkaEventPayloadDto {
	static readonly EventType = KafkaEventTypes.Channels.ChannelCreated;

	static createPayload(
		channelId: string,
		userId: string,
		name: string,
		description: string | null,
		subscriberCount: string,
		createdDate: Date,
	): ChannelCreatedKafkaEventPayload {
		return ChannelCreatedKafkaEventPayloadDto.buildPayload({
			channelId,
			userId,
			name,
			description,
			subscriberCount,
			createdDate,
		});
	}
}
