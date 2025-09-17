import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { CommentRateCreatedKafkaEventPayload, CommentRateType } from "~kafka/types/events/comment-rates";

export class CommentRateCreatedKafkaEventPayloadDto
	extends BaseKafkaEventPayloadDto
	implements CommentRateCreatedKafkaEventPayload
{
	type = KafkaEventTypes.CommentRates.CommentRateCreated;

	constructor(commentId: string, rateType: CommentRateType) {
		super();

		this.commentId = commentId;
		this.rateType = rateType;
	}

	commentId: string;

	rateType: CommentRateType;
}
