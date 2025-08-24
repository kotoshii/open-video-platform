import { ChannelAuthenticationDetailsRequest } from "@ovp-proto/types/channels";
import { IsNotEmpty, IsString } from "class-validator";

export class ChannelAuthDetailsGrpcRequestDto implements ChannelAuthenticationDetailsRequest {
	@IsString()
	@IsNotEmpty()
	userId: string;

	@IsString()
	@IsNotEmpty()
	channelId: string;
}
