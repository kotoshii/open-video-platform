import { CreateVideoRequest } from "@ovp-proto/types/videos";
import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateVideoGrpcRequestDto implements CreateVideoRequest {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	channelId: string;

	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	title: string;
}
