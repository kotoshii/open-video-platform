import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayload } from "~kafka/types/events/base-kafka-event-payload";

export type CommentKafkaEventPayload = CommentCreatedKafkaEventPayload | CommentDeletedKafkaEventPayload;

export interface CommentCreatedKafkaEventPayload extends BaseKafkaEventPayload {
	type: typeof KafkaEventTypes.Comments.CommentCreated;
	videoId: string;
}

export interface CommentDeletedKafkaEventPayload extends BaseKafkaEventPayload {
	type: typeof KafkaEventTypes.Comments.CommentDeleted;
	videoId: string;
}
