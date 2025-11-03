import * as path from "node:path";

import { BadRequestException, Inject, Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { VIDEO_SERVICE_NAME, VIDEOS_PACKAGE_NAME, VideoServiceClient } from "@ovp-proto/types/videos";
import mimeTypes from "mime-types";

import { VideoUploadStatus } from "~db/schema";
import { VideoUploadConfig } from "~src/config/providers/video-upload.config";
import { CreateVideoUploadDto } from "~src/video-uploads/dto/create-video-upload.dto";
import { GetVideoUploadDto } from "~src/video-uploads/dto/get-video-upload.dto";
import { VideoUploadRepository } from "~src/video-uploads/repositories/video-upload.repository";

@Injectable()
export class VideoUploadService implements OnModuleInit {
	private videoGrpcService: VideoServiceClient;
	private readonly logger = new Logger(VideoUploadService.name);

	constructor(
		@Inject(VIDEOS_PACKAGE_NAME) private videoClientGrpc: ClientGrpc,

		private readonly videoUploadRepository: VideoUploadRepository,
		private readonly videoUploadConfig: VideoUploadConfig,
	) {}

	onModuleInit() {
		this.videoGrpcService = this.videoClientGrpc.getService<VideoServiceClient>(VIDEO_SERVICE_NAME);
	}

	async initializeUploadOrThrow(channelId: string, dto: CreateVideoUploadDto) {
		const { name, size, type: mimeTypeFromClient } = dto;

		const extName = path.extname(name).replace(".", "").toLowerCase();
		const mimeTypeFromName = mimeTypes.lookup(name);

		const isValidFileFormat = extName.length && this.videoUploadConfig.allowedVideoFileFormats.includes(extName);
		const isValidMimeType =
			mimeTypeFromName &&
			mimeTypeFromName === mimeTypeFromClient &&
			mimeTypeFromName.includes("video") &&
			mimeTypeFromClient.includes("video");

		if (!isValidFileFormat || !isValidMimeType) {
			this.logger.warn(
				`File upload session init failed; invalid format: filename ${name}, client mimetype ${mimeTypeFromClient}, resolved mimetype ${mimeTypeFromName}`,
			);
			throw new BadRequestException("Provided file format is not allowed");
		}

		if (size > this.videoUploadConfig.maxVideoFileSizeInBytes) {
			this.logger.warn(
				`File upload session init failed; file too big: size ${size}, max allowed ${this.videoUploadConfig.maxVideoFileSizeInBytes}`,
			);
			throw new BadRequestException("Provided file size exceeds allowed limit of 10 GiB");
		}

		const video = await this.createVideo(channelId, name);

		if (!video) {
			throw new Error(`Failed to create video for upload session: channelId ${channelId}, file ${JSON.stringify(dto)}`);
		}

		const videoUpload = await this.videoUploadRepository.createVideoUpload({
			channelId,
			videoId: video.id,
			status: VideoUploadStatus.Initialized,
			originalFilename: name,
			originalSize: size,
			originalMimetype: mimeTypeFromClient,
		});

		return new GetVideoUploadDto(videoUpload);
	}

	async getUploadByVideoIdOrThrow(channelId: string, videoId: string) {
		const videoUpload = await this.videoUploadRepository.getVideoUploadByVideoId(videoId);

		if (!videoUpload || videoUpload.channelId !== channelId) {
			throw new NotFoundException("Video upload not found");
		}

		return new GetVideoUploadDto(videoUpload);
	}

	private async createVideo(channelId: string, title: string) {
		const response = await this.videoGrpcService.createVideo({ channelId, title }).toPromise();
		return response?.video || null;
	}
}
