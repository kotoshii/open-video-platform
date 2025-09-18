import { Injectable } from "@nestjs/common";
import { CommentRateType } from "@ovp-lib/api/kafka/types/events/comment-rates";

import { CommentRepository } from "~src/videos/repositories/comment.repository";

@Injectable()
export class CommentService {
	constructor(private readonly videoRepository: CommentRepository) {}

	async updateRateCounts(commentsIds: string[], rateTypes: CommentRateType[], deltas: number[]) {
		await this.videoRepository.updateRateCounts(commentsIds, rateTypes, deltas);
	}
}
