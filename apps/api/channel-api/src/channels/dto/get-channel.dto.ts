import { Selectable } from "kysely";

import { Channel } from "~db/schema";

export class GetChannelDto {
	constructor(channel: Selectable<Channel>) {
		const { id, userId, name, description, subscriberCount, createdDate, updatedDate } = channel;

		this.id = id;
		this.userId = userId;
		this.name = name;
		this.description = description;
		this.subscriberCount = subscriberCount;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	id: string;

	userId: string;

	name: string;

	description: string | null;

	subscriberCount: string;

	createdDate: Date;

	updatedDate: Date;
}
