import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayload } from "~kafka/types/events/base-kafka-event-payload";

export type VideoKafkaEventPayload = VideoViewedKafkaEventPayload;

export interface VideoViewedKafkaEventPayload extends BaseKafkaEventPayload {
	type: typeof KafkaEventTypes.Videos.VideoViewed;
	videoId: string;
	// channel ID
	viewerId: string | null;
	userAgent: string | null;
	ipAddress: string | null;
}
