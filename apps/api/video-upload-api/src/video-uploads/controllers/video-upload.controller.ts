import { Body, Controller, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse } from "@nestjs/swagger";
import { ChannelId } from "@ovp-lib/api/auth/decorators/channel-id.decorator";
import { NestErrorResponseDto } from "@ovp-lib/api/common/dto/nest-error-response.dto";

import { CreateVideoUploadDto } from "~src/video-uploads/dto/create-video-upload.dto";
import { GetVideoUploadDto } from "~src/video-uploads/dto/get-video-upload.dto";
import { VideoUploadService } from "~src/video-uploads/services/video-upload.service";

@Controller("video-uploads")
export class VideoUploadController {
	constructor(private readonly videoUploadService: VideoUploadService) {}

	@ApiCreatedResponse({ description: "Initialized a new upload session", type: GetVideoUploadDto })
	@ApiBadRequestResponse({ description: "Invalid file format or file is too big", type: NestErrorResponseDto })
	@Post("initialize")
	async initializeUpload(@ChannelId() channelId: string, @Body() body: CreateVideoUploadDto) {
		return this.videoUploadService.initializeUploadOrThrow(channelId, body);
	}
}
