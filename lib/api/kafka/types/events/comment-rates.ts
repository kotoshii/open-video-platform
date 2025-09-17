import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayload } from "~kafka/types/events/base-kafka-event-payload";

export type CommentRateKafkaEventPayload =
	| CommentRateCreatedKafkaEventPayload
	| CommentRateDeletedKafkaEventPayload
	| CommentRateUpdatedKafkaEventPayload;

export type CommentRateType = "like" | "dislike";

export interface CommentRateCreatedKafkaEventPayload extends BaseKafkaEventPayload {
	type: typeof KafkaEventTypes.CommentRates.CommentRateCreated;
	commentId: string;
	rateType: CommentRateType;
}

export interface CommentRateDeletedKafkaEventPayload extends BaseKafkaEventPayload {
	type: typeof KafkaEventTypes.CommentRates.CommentRateDeleted;
	commentId: string;
	rateType: CommentRateType;
}

export interface CommentRateUpdatedKafkaEventPayload extends BaseKafkaEventPayload {
	type: typeof KafkaEventTypes.CommentRates.CommentRateUpdated;
	commentId: string;
	oldRateType: CommentRateType;
	newRateType: CommentRateType;
}
