import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayload } from "~kafka/types/events/base-kafka-event-payload";

export type VideoRateKafkaEventPayload = VideoRateCreatedKafkaEventPayload | VideoRateDeletedKafkaEventPayload;

export type VideoRateType = "like" | "dislike";

export interface VideoRateCreatedKafkaEventPayload extends BaseKafkaEventPayload {
	type: typeof KafkaEventTypes.VideoRates.VideoRateCreated;
	videoId: string;
	rateType: VideoRateType;
}

export interface VideoRateDeletedKafkaEventPayload extends BaseKafkaEventPayload {
	type: typeof KafkaEventTypes.VideoRates.VideoRateDeleted;
	videoId: string;
	rateType: VideoRateType;
}

export interface VideoRateUpdatedKafkaEventPayload extends BaseKafkaEventPayload {
	type: typeof KafkaEventTypes.VideoRates.VideoRateUpdated;
	videoId: string;
	oldRateType: VideoRateType;
	newRateType: VideoRateType;
}
