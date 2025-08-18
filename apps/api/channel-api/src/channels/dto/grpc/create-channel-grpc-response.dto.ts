import { CreateChannelResponse } from "@ovp-proto/types/channels";

import { GetChannelDto } from "~src/channels/dto/get-channel.dto";
import { ChannelGrpcResponseDto } from "~src/channels/dto/grpc/channel-grpc-response.dto";

export class CreateChannelGrpcResponseDto implements CreateChannelResponse {
	constructor(channel: GetChannelDto) {
		this.channel = new ChannelGrpcResponseDto(channel);
	}

	channel: ChannelGrpcResponseDto;
}
