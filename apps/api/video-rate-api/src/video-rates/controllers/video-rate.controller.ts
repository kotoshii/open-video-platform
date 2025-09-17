import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse } from "@nestjs/swagger";
import { ChannelId } from "@ovp-lib/api/auth/decorators/channel-id.decorator";
import { UserId } from "@ovp-lib/api/auth/decorators/user-id.decorator";
import { NestErrorResponseDto } from "@ovp-lib/api/common/dto/nest-error-response.dto";

import { GetVideoRateDto } from "~src/video-rates/dto/get-video-rate.dto";
import { UpsertVideoRateDto } from "~src/video-rates/dto/upsert-video-rate.dto";
import { VideoRateService } from "~src/video-rates/services/video-rate.service";

@Controller("video-rates")
export class VideoRateController {
	constructor(private readonly videoRateService: VideoRateService) {}

	@ApiOkResponse({ type: GetVideoRateDto })
	@ApiForbiddenResponse({
		type: NestErrorResponseDto,
		description: "Rates are disabled for the requested video",
	})
	@ApiNotFoundResponse({ type: NestErrorResponseDto, description: "Video not found or user cannot access it" })
	@Post(":videoId")
	async upsertVideoRate(
		@Param("videoId") videoId: string,
		@UserId() userId: string,
		@ChannelId() channelId: string,
		@Body() body: UpsertVideoRateDto,
	) {
		return this.videoRateService.upsertVideoRateOrThrow(videoId, userId, channelId, body);
	}

	// TODO: Rework - most requests will return 404, so better to just return null and `200 OK`.
	@ApiOkResponse({ type: GetVideoRateDto })
	@ApiNotFoundResponse({ type: NestErrorResponseDto, description: "Video rate not found" })
	@Get(":videoId")
	async getVideoRate(@Param("videoId") videoId: string, @ChannelId() channelId: string) {
		return this.videoRateService.getVideoRateOrThrow(videoId, channelId);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiNoContentResponse({ description: "Successfully deleted or didn't even exist" })
	@Delete(":videoId")
	async deleteVideoRate(@Param("videoId") videoId: string, @ChannelId() channelId: string) {
		return this.videoRateService.deleteVideoRate(videoId, channelId);
	}
}
