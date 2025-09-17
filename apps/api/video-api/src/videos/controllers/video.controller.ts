import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Put, Query } from "@nestjs/common";
import { ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse } from "@nestjs/swagger";
import { ChannelId } from "@ovp-lib/api/auth/decorators/channel-id.decorator";
import { UserId } from "@ovp-lib/api/auth/decorators/user-id.decorator";
import { NestErrorResponseDto } from "@ovp-lib/api/common/dto/nest-error-response.dto";
import { ApiPaginatedResponse } from "@ovp-lib/api/pagination/decorators/api-paginated-response.decorator";
import { Pagination } from "@ovp-lib/api/pagination/decorators/pagination.decorator";
import { RealIP } from "nestjs-real-ip";

import { EditVideoDetailsDto } from "~src/videos/dto/edit-video-details.dto";
import { GetVideoForChannelDto } from "~src/videos/dto/get-video-for-channel.dto";
import { GetVideoForEditingDto } from "~src/videos/dto/get-video-for-editing.dto";
import { GetVideoForViewerDto } from "~src/videos/dto/get-video-for-viewer.dto";
import { GetVideosForChannelFilterDto } from "~src/videos/dto/get-videos-for-channel-filter.dto";
import { GetVideosForChannelPaginationOptionsDto } from "~src/videos/dto/get-videos-for-channel-pagination-options.dto";
import { VideoService } from "~src/videos/services/video.service";

@Controller("videos")
export class VideoController {
	constructor(private readonly videoService: VideoService) {}

	@ApiOkResponse({ type: GetVideoForViewerDto })
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

	@ApiOkResponse({ type: GetVideoForEditingDto })
	@ApiForbiddenResponse({
		type: NestErrorResponseDto,
		description: "User is trying to access someone else's video",
	})
	@ApiNotFoundResponse({ type: NestErrorResponseDto, description: "Video not found" })
	@Get(":id/edit")
	async getVideoByIdForEditing(@Param("id") videoId: string, @ChannelId() channelId: string) {
		return this.videoService.getVideoByIdForEditingOrThrow(videoId, channelId);
	}

	@ApiOkResponse({ type: GetVideoForEditingDto })
	@ApiForbiddenResponse({
		type: NestErrorResponseDto,
		description: "User is trying to access someone else's video",
	})
	@ApiNotFoundResponse({ type: NestErrorResponseDto, description: "Video not found" })
	@Put(":id/edit")
	async editVideoDetailsById(
		@Param("id") videoId: string,
		@ChannelId() channelId: string,
		@Body() body: EditVideoDetailsDto,
	) {
		return this.videoService.editVideoDetailsByIdOrThrow(videoId, channelId, body);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiNoContentResponse({ description: "Successfully created video deletion request" })
	@ApiForbiddenResponse({
		type: NestErrorResponseDto,
		description: "User is trying to access someone else's video",
	})
	@ApiNotFoundResponse({ type: NestErrorResponseDto, description: "Video not found" })
	@Delete(":id")
	async deleteVideoById(@Param("id") videoId: string, @ChannelId() channelId: string) {
		return this.videoService.deleteVideoByIdOrThrow(videoId, channelId);
	}

	@ApiPaginatedResponse(GetVideoForChannelDto, GetVideosForChannelPaginationOptionsDto)
	@Get("for-channel/:channelId")
	async getVideosForChannel(
		@Param("channelId") channelId: string,
		@Query() filter: GetVideosForChannelFilterDto,
		@Pagination(GetVideosForChannelPaginationOptionsDto) pagination: GetVideosForChannelPaginationOptionsDto,
		@ChannelId() currentChannelId: string,
	) {
		return this.videoService.getPaginatedVideosByChannelId(channelId, filter, pagination, currentChannelId);
	}
}
