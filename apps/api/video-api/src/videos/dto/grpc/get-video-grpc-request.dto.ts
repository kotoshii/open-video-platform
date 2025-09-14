import { GetVideoRequest } from "@ovp-proto/types/videos";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class GetVideoGrpcRequestDto implements GetVideoRequest {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	videoId: string;

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	userId: string;

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	channelId: string;
}
