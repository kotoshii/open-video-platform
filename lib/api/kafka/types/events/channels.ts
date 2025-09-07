import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayload } from "~kafka/types/events/base-kafka-event-payload";

export type ChannelKafkaEventPayload = ChannelCreatedKafkaEventPayload | ChannelUpdatedKafkaEventPayload;

export interface ChannelCreatedKafkaEventPayload extends BaseKafkaEventPayload {
	type: typeof KafkaEventTypes.Channels.ChannelCreated;

	channelId: string;
	userId: string;
	name: string;
	description: string | null;
	subscriberCount: string;
	createdDate: Date;
}

export interface ChannelUpdatedKafkaEventPayload extends BaseKafkaEventPayload {
	type: typeof KafkaEventTypes.Channels.ChannelUpdated;

	channelId: string;
	name: string;
	description: string | null;
}
