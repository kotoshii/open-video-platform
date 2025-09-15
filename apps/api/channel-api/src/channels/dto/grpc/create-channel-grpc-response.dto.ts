import { CreateChannelResponse } from "@ovp-proto/types/channels";
import { Selectable } from "kysely";

import { Channel } from "~db/schema";
import { ChannelGrpcResponseDto } from "~src/channels/dto/grpc/channel-grpc-response.dto";

export class CreateChannelGrpcResponseDto implements CreateChannelResponse {
	constructor(channel: Selectable<Channel>) {
		this.channel = new ChannelGrpcResponseDto(channel);
	}

	channel: ChannelGrpcResponseDto;
}
