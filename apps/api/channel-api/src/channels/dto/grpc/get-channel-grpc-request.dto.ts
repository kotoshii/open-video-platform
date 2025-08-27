import { GetChannelRequest } from "@ovp-proto/types/channels";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class GetChannelGrpcRequestDto implements GetChannelRequest {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	channelId: string;
}
