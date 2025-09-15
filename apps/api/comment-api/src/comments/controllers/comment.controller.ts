import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse } from "@nestjs/swagger";
import { ChannelId } from "@ovp-lib/api/auth/decorators/channel-id.decorator";
import { UserId } from "@ovp-lib/api/auth/decorators/user-id.decorator";
import { NestErrorResponseDto } from "@ovp-lib/api/common/dto/nest-error-response.dto";

import { CreateCommentDto } from "~src/comments/dto/create-comment.dto";
import { GetCommentDto } from "~src/comments/dto/get-comment.dto";
import { CommentService } from "~src/comments/services/comment.service";

@Controller("comments")
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@ApiCreatedResponse({ type: GetCommentDto })
	@ApiForbiddenResponse({ type: NestErrorResponseDto, description: "Comments are disabled for the requested video" })
	@ApiNotFoundResponse({
		type: NestErrorResponseDto,
		description: "Video not found or user cannot access it; parent comment not found; channel does not exist anymore",
	})
	@ApiBadRequestResponse({ type: NestErrorResponseDto, description: "Requested parent comment is already a reply" })
	@Post(":videoId")
	async createComment(
		@UserId() userId: string,
		@ChannelId() channelId: string,
		@Param("videoId") videoId: string,
		@Body() body: CreateCommentDto,
	) {
		return this.commentService.createComment(userId, channelId, videoId, body);
	}
}
