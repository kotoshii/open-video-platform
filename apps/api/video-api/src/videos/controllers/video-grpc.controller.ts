import { Payload } from "@nestjs/microservices";
import { GrpcController } from "@ovp-lib/api/grpc/decorators/grpc-controller.decorator";
import { VideoServiceController, VideoServiceControllerMethods } from "@ovp-proto/types/videos";

import { CreateVideoGrpcRequestDto } from "~src/videos/dto/grpc/create-video-grpc-request.dto";
import { CreateVideoGrpcResponseDto } from "~src/videos/dto/grpc/create-video-grpc-response.dto";
import { VideoService } from "~src/videos/services/video.service";

@GrpcController()
@VideoServiceControllerMethods()
export class VideoGrpcController implements VideoServiceController {
	constructor(private readonly videoService: VideoService) {}

	async createVideo(@Payload() body: CreateVideoGrpcRequestDto): Promise<CreateVideoGrpcResponseDto> {
		const { title, channelId } = body;

		const video = await this.videoService.createVideoOrThrow(title, channelId);
		return new CreateVideoGrpcResponseDto(video.toPlain());
	}
}
