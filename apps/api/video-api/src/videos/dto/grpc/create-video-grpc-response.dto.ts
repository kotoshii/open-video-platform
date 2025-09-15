import { CreateVideoResponse } from "@ovp-proto/types/videos";
import { Selectable } from "kysely";

import { Video } from "~db/schema";
import { VideoGrpcResponseDto } from "~src/videos/dto/grpc/video-grpc-response.dto";

export class CreateVideoGrpcResponseDto implements CreateVideoResponse {
	constructor(video: Selectable<Video>) {
		this.video = new VideoGrpcResponseDto(video);
	}

	video: VideoGrpcResponseDto;
}
