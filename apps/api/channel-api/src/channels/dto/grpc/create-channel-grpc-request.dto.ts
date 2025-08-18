import { CreateChannelRequest } from "@ovp-proto/types/channels";
import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateChannelGrpcRequestDto implements CreateChannelRequest {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	userId: string;

	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	name: string;
}
