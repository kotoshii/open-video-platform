import { Module } from "@nestjs/common";

import { ChannelRepository } from "~src/channels/repositories/channel.repository";
import { ChannelService } from "~src/channels/services/channel.service";

@Module({
	providers: [ChannelService, ChannelRepository],
	exports: [ChannelService],
})
export class ChannelsModule {}
