import { Channel } from "@ovp-proto/types/channels";

import { GetChannelDto } from "~src/channels/dto/get-channel.dto";

export class ChannelGrpcResponseDto implements Channel {
	constructor(channel: GetChannelDto) {
		const { id, userId, name, description, subscriberCount, createdDate, updatedDate } = channel;

		this.id = id;
		this.userId = userId;
		this.name = name;
		this.description = description || undefined;
		this.subscriberCount = subscriberCount;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	id: string;

	userId: string;

	name: string;

	description: string | undefined;

	subscriberCount: string;

	createdDate: Date;

	updatedDate: Date;
}
