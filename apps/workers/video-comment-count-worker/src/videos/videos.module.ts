import { Module } from "@nestjs/common";

import { VideoRepository } from "~src/videos/repositories/video.repository";
import { VideoService } from "~src/videos/services/video.service";

@Module({
	providers: [VideoService, VideoRepository],
	exports: [VideoService],
})
export class VideosModule {}
