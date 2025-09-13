import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Selectable } from "kysely";

import { Subscription } from "~db/schema";

export class GetSubscriptionDto {
	constructor(subscription: Selectable<Subscription>) {
		const { id, subscriberId, channelId, channelName, createdDate, updatedDate } = subscription;

		this.id = id;
		this.subscriberId = subscriberId;
		this.channelId = channelId;
		this.channelName = channelName;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	@ApiProperty()
	id: string;

	@ApiProperty()
	subscriberId: string;

	@ApiProperty()
	channelId: string;

	@ApiProperty()
	channelName: string;

	@Exclude()
	createdDate: Date;

	@Exclude()
	updatedDate: Date;

	static fromArray(subscriptions: Selectable<Subscription>[]) {
		return subscriptions.map((subscription) => new GetSubscriptionDto(subscription));
	}
}
