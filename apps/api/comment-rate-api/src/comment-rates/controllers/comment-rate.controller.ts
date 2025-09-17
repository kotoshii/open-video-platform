import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse } from "@nestjs/swagger";
import { ChannelId } from "@ovp-lib/api/auth/decorators/channel-id.decorator";
import { NestErrorResponseDto } from "@ovp-lib/api/common/dto/nest-error-response.dto";

import { GetCommentRateDto } from "~src/comment-rates/dto/get-comment-rate.dto";
import { UpsertCommentRateDto } from "~src/comment-rates/dto/upsert-comment-rate.dto";
import { CommentRateService } from "~src/comment-rates/services/comment-rate.service";

@Controller("comment-rates")
export class CommentRateController {
	constructor(private readonly commentRateService: CommentRateService) {}

	@ApiCreatedResponse({ type: GetCommentRateDto })
	@ApiNotFoundResponse({ type: NestErrorResponseDto, description: "Comment not found" })
	@Post(":commentId")
	async upsertCommentRate(
		@Param("commentId") commentId: string,
		@ChannelId() channelId: string,
		@Body() body: UpsertCommentRateDto,
	) {
		return this.commentRateService.upsertCommentRateOrThrow(commentId, channelId, body);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiNoContentResponse({ description: "Successfully deleted or didn't even exist" })
	@Delete(":commentId")
	async deleteCommentRate(@Param("commentId") commentId: string, @ChannelId() channelId: string) {
		return this.commentRateService.deleteCommentRate(commentId, channelId);
	}
}
