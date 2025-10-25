import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class VideoUploadConfig {
	constructor(protected config: ConfigService) {}

	// default: 10 GB (10737418240 bytes)
	get maxVideoFileSizeInBytes() {
		return Number(this.config.get<string>("MAX_VIDEO_FILE_SIZE_BYTES", "10737418240"));
	}

	// files format (extension) list - e.g. ["mp4", "avi", "mkv", ...]
	get allowedVideoFileFormats() {
		return this.config.get<string>("ALLOWED_VIDEO_FILE_FORMATS", "").split(",");
	}
}
