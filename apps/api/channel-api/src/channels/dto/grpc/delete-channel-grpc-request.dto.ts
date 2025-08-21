import { DeleteChannelRequest } from "@ovp-proto/types/channels";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class DeleteChannelGrpcRequestDto implements DeleteChannelRequest {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	channelId: string;
}
