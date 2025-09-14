import { KafkaEventTypes } from "~kafka/constants/event-types";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";
import { VideoRateType, VideoRateUpdatedKafkaEventPayload } from "~kafka/types/events/video-rates";

export class VideoRateUpdatedKafkaEventPayloadDto
	extends BaseKafkaEventPayloadDto
	implements VideoRateUpdatedKafkaEventPayload
{
	type = KafkaEventTypes.VideoRates.VideoRateUpdated;

	constructor(videoId: string, oldRateType: VideoRateType, newRateType: VideoRateType) {
		super();

		this.videoId = videoId;
		this.oldRateType = oldRateType;
		this.newRateType = newRateType;
	}

	videoId: string;

	oldRateType: VideoRateType;

	newRateType: VideoRateType;
}
