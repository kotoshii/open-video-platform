import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
} from "@nestjs/swagger";
import { ChannelId } from "@ovp-lib/api/auth/decorators/channel-id.decorator";
import { UserId } from "@ovp-lib/api/auth/decorators/user-id.decorator";
import { NestErrorResponseDto } from "@ovp-lib/api/common/dto/nest-error-response.dto";

import { CreateCommentDto } from "~src/comments/dto/create-comment.dto";
import { GetCommentDto } from "~src/comments/dto/get-comment.dto";
import { UpdateCommentDto } from "~src/comments/dto/update-comment.dto";
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
		return this.commentService.createCommentOrThrow(userId, channelId, videoId, body);
	}

	@ApiOkResponse({ type: GetCommentDto })
	@ApiForbiddenResponse({ type: NestErrorResponseDto, description: "User tries to update someone else's comment" })
	@ApiNotFoundResponse({ type: NestErrorResponseDto, description: "Comment not found" })
	@Put(":commentId")
	async updateCommentById(
		@ChannelId() channelId: string,
		@Param("commentId") commentId: string,
		@Body() body: UpdateCommentDto,
	) {
		return this.commentService.updateCommentByIdOrThrow(channelId, commentId, body);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiNoContentResponse({ description: "Successfully deleted" })
	@ApiForbiddenResponse({ type: NestErrorResponseDto, description: "User tries to delete someone else's comment" })
	@ApiNotFoundResponse({ type: NestErrorResponseDto, description: "Comment not found" })
	@Delete(":commentId")
	async deleteCommentById(@ChannelId() channelId: string, @Param("commentId") commentId: string) {
		return this.commentService.deleteCommentByIdOrThrow(channelId, commentId);
	}
}
