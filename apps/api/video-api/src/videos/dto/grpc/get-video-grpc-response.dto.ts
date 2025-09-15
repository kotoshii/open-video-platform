import { GetVideoResponse } from "@ovp-proto/types/videos";
import { Selectable } from "kysely";

import { Video } from "~db/schema";
import { VideoGrpcResponseDto } from "~src/videos/dto/grpc/video-grpc-response.dto";

export class GetVideoGrpcResponseDto implements GetVideoResponse {
	constructor(video: Selectable<Video> | null) {
		this.video = video ? new VideoGrpcResponseDto(video) : undefined;
	}

	video: VideoGrpcResponseDto | undefined;
}
