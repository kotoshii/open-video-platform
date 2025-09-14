import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { VideoViewedKafkaEventPayload } from "~kafka/types/events/videos";

export class VideoViewedKafkaEventPayloadDto extends BaseKafkaEventPayloadDto implements VideoViewedKafkaEventPayload {
	type = KafkaEventTypes.Videos.VideoViewed;

	constructor(videoId: string, viewerId: string | null, userAgent: string | null, ipAddress: string | null) {
		super();

		this.videoId = videoId;
		this.viewerId = viewerId;
		this.userAgent = userAgent;
		this.ipAddress = ipAddress;
	}

	videoId: string;

	viewerId: string | null;

	userAgent: string | null;

	ipAddress: string | null;
}
