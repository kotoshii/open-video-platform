import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { CommentRateDeletedKafkaEventPayload, CommentRateType } from "~kafka/types/events/comment-rates";

export class CommentRateDeletedKafkaEventPayloadDto
	extends BaseKafkaEventPayloadDto
	implements CommentRateDeletedKafkaEventPayload
{
	type = KafkaEventTypes.CommentRates.CommentRateDeleted;

	constructor(commentId: string, rateType: CommentRateType) {
		super();

		this.commentId = commentId;
		this.rateType = rateType;
	}

	commentId: string;

	rateType: CommentRateType;
}
