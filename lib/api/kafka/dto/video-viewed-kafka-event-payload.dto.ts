import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { VideoViewedKafkaEventPayload } from "~kafka/types/events/videos";

export class VideoViewedKafkaEventPayloadDto extends BaseKafkaEventPayloadDto {
	static readonly EventType = KafkaEventTypes.Videos.VideoViewed;

	static createPayload(
		videoId: string,
		viewerId: string | null,
		userAgent: string | null,
		ipAddress: string | null,
	): VideoViewedKafkaEventPayload {
		return VideoViewedKafkaEventPayloadDto.buildPayload({
			videoId,
			viewerId,
			userAgent,
			ipAddress,
		});
	}
}
