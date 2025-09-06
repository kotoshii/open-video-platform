import { Injectable } from "@nestjs/common";

import { ChannelRepository } from "~src/channels/repositories/channel.repository";

@Injectable()
export class ChannelService {
	constructor(private readonly channelRepository: ChannelRepository) {}

	async updateSubscriberCounts(channelIds: string[], deltas: number[]) {
		await this.channelRepository.updateSubscriberCounts(channelIds, deltas);
	}
}
