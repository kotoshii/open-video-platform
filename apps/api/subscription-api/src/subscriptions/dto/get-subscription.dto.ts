import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Selectable } from "kysely";

import { Subscription } from "~db/schema";

export class GetSubscriptionDto {
	constructor(subscription: Selectable<Subscription>) {
		const { id, subscriberChannelId, subscribedChannelId, subscribedChannelName, createdDate, updatedDate } =
			subscription;

		this.id = id;
		this.subscriberChannelId = subscriberChannelId;
		this.subscribedChannelId = subscribedChannelId;
		this.subscribedChannelName = subscribedChannelName;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	@ApiProperty()
	id: string;

	@ApiProperty()
	subscriberChannelId: string;

	@ApiProperty()
	subscribedChannelId: string;

	@ApiProperty()
	subscribedChannelName: string;

	@Exclude()
	createdDate: Date;

	@Exclude()
	updatedDate: Date;
}
