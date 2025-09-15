import { GetChannelResponse } from "@ovp-proto/types/channels";
import { Selectable } from "kysely";

import { Channel } from "~db/schema";
import { ChannelGrpcResponseDto } from "~src/channels/dto/grpc/channel-grpc-response.dto";

export class GetChannelGrpcResponseDto implements GetChannelResponse {
	constructor(channel: Selectable<Channel> | null) {
		this.channel = channel ? new ChannelGrpcResponseDto(channel) : undefined;
	}

	channel: ChannelGrpcResponseDto | undefined;
}
