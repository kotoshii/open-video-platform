import { GetChannelResponse } from "@ovp-proto/types/channels";

import { GetChannelDto } from "~src/channels/dto/get-channel.dto";
import { ChannelGrpcResponseDto } from "~src/channels/dto/grpc/channel-grpc-response.dto";

export class GetChannelGrpcResponseDto implements GetChannelResponse {
	constructor(channel: GetChannelDto) {
		this.channel = new ChannelGrpcResponseDto(channel);
	}

	channel: ChannelGrpcResponseDto;
}
