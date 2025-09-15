import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { CommentCreatedKafkaEventPayload } from "~kafka/types/events/comments";

export class CommentCreatedKafkaEventPayloadDto
	extends BaseKafkaEventPayloadDto
	implements CommentCreatedKafkaEventPayload
{
	type = KafkaEventTypes.Comments.CommentCreated;

	constructor(videoId: string) {
		super();
		this.videoId = videoId;
	}

	videoId: string;
}
