import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { VideoRateDeletedKafkaEventPayload, VideoRateType } from "~kafka/types/events/video-rates";

export class VideoRateDeletedKafkaEventPayloadDto
	extends BaseKafkaEventPayloadDto
	implements VideoRateDeletedKafkaEventPayload
{
	type = KafkaEventTypes.VideoRates.VideoRateDeleted;

	constructor(videoId: string, rateType: VideoRateType) {
		super();

		this.videoId = videoId;
		this.rateType = rateType;
	}

	videoId: string;

	rateType: VideoRateType;
}
