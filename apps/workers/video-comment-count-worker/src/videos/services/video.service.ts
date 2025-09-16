import { Injectable } from "@nestjs/common";

import { VideoRepository } from "~src/videos/repositories/video.repository";

@Injectable()
export class VideoService {
	constructor(private readonly videoRepository: VideoRepository) {}

	async updateCommentCounts(videoIds: string[], deltas: number[]) {
		await this.videoRepository.updateCommentCounts(videoIds, deltas);
	}
}
