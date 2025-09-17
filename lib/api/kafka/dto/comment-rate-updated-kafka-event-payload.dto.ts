import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { CommentRateType, CommentRateUpdatedKafkaEventPayload } from "~kafka/types/events/comment-rates";

export class CommentRateUpdatedKafkaEventPayloadDto
	extends BaseKafkaEventPayloadDto
	implements CommentRateUpdatedKafkaEventPayload
{
	type = KafkaEventTypes.CommentRates.CommentRateUpdated;

	constructor(commentId: string, oldRateType: CommentRateType, newRateType: CommentRateType) {
		super();

		this.commentId = commentId;
		this.oldRateType = oldRateType;
		this.newRateType = newRateType;
	}

	commentId: string;

	oldRateType: CommentRateType;

	newRateType: CommentRateType;
}
