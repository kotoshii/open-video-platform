import { Module } from "@nestjs/common";
import { GrpcClientsModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/grpc-clients-module-config-builder";
import { ProtoPaths } from "@ovp-proto/types/utils/paths";
import { VIDEOS_PACKAGE_NAME } from "@ovp-proto/types/videos";

import { GrpcConfig } from "~src/config/providers/grpc.config";
import { VideoUploadController } from "~src/video-uploads/controllers/video-upload.controller";
import { VideoUploadRepository } from "~src/video-uploads/repositories/video-upload.repository";
import { VideoUploadService } from "~src/video-uploads/services/video-upload.service";

@Module({
	imports: [
		GrpcClientsModuleConfigBuilderFactory.create(GrpcConfig)
			.addClient(VIDEOS_PACKAGE_NAME, "grpcVideoServiceUrl", ProtoPaths.Videos)
			.build(),
	],
	controllers: [VideoUploadController],
	providers: [VideoUploadRepository, VideoUploadService],
	exports: [VideoUploadService],
})
export class VideoUploadsModule {}
