import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { VideoRateCreatedKafkaEventPayload, VideoRateType } from "~kafka/types/events/video-rates";

export class VideoRateCreatedKafkaEventPayloadDto
	extends BaseKafkaEventPayloadDto
	implements VideoRateCreatedKafkaEventPayload
{
	type = KafkaEventTypes.VideoRates.VideoRateCreated;

	constructor(videoId: string, rateType: VideoRateType) {
		super();

		this.videoId = videoId;
		this.rateType = rateType;
	}

	videoId: string;

	rateType: VideoRateType;
}
