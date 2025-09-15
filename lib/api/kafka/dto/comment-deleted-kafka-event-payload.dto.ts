import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { CommentDeletedKafkaEventPayload } from "~kafka/types/events/comments";

export class CommentDeletedKafkaEventPayloadDto
	extends BaseKafkaEventPayloadDto
	implements CommentDeletedKafkaEventPayload
{
	type = KafkaEventTypes.Comments.CommentDeleted;

	constructor(videoId: string) {
		super();
		this.videoId = videoId;
	}

	videoId: string;
}
