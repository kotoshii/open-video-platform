import { Controller, Get, Headers, Param } from "@nestjs/common";
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse } from "@nestjs/swagger";
import { ChannelId } from "@ovp-lib/api/auth/decorators/channel-id.decorator";
import { UserId } from "@ovp-lib/api/auth/decorators/user-id.decorator";
import { NestErrorResponseDto } from "@ovp-lib/api/common/dto/nest-error-response.dto";
import { RealIP } from "nestjs-real-ip";

import { GetVideoDto } from "~src/videos/dto/get-video.dto";
import { VideoService } from "~src/videos/services/video.service";

@Controller("videos")
export class VideoController {
	constructor(private readonly videoService: VideoService) {}

	@ApiOkResponse({ type: GetVideoDto })
	@ApiForbiddenResponse({
		type: NestErrorResponseDto,
		description: "Video is private or video is NSFW and user cannot access it",
	})
	@ApiNotFoundResponse({ type: NestErrorResponseDto, description: "Video not found" })
	@Get(":id/watch")
	async watchVideoById(
		@Param("id") videoId: string,
		@UserId() userId: string,
		@ChannelId() channelId: string,
		@Headers("user-agent") userAgent: string,
		@RealIP() ipAddress: string,
	) {
		return this.videoService.watchVideoByIdOrThrow(videoId, userId, channelId, userAgent, ipAddress);
	}
}
