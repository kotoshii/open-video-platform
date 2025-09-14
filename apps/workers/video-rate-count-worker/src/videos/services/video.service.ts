import { Injectable } from "@nestjs/common";
import { VideoRateType } from "@ovp-lib/api/kafka/types/events/video-rates";

import { VideoRepository } from "~src/videos/repositories/video.repository";

@Injectable()
export class VideoService {
	constructor(private readonly videoRepository: VideoRepository) {}

	async updateRateCounts(videoIds: string[], rateTypes: VideoRateType[], deltas: number[]) {
		await this.videoRepository.updateRateCounts(videoIds, rateTypes, deltas);
	}
}
