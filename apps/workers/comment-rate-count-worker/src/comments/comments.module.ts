import { Module } from "@nestjs/common";

import { CommentRepository } from "~src/comments/repositories/comment.repository";
import { CommentService } from "~src/comments/services/comment.service";

@Module({
	providers: [CommentService, CommentRepository],
	exports: [CommentService],
})
export class CommentsModule {}
