import { ChannelAuthenticationDetailsResponse } from "@ovp-proto/types/channels";

export class ChannelAuthDetailsGrpcResponseDto implements ChannelAuthenticationDetailsResponse {
	constructor(valid: boolean, channelId?: string) {
		this.valid = valid;
		this.channelId = channelId;
	}

	valid: boolean;

	channelId?: string;
}
