import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Selectable } from "kysely";

import { Channel } from "~db/schema";

export class GetChannelDto {
	constructor(channel: Selectable<Channel>, isSubscribed?: boolean) {
		const { id, userId, name, description, subscriberCount, createdDate, updatedDate } = channel;

		this.id = id;
		this.userId = userId;
		this.name = name;
		this.description = description;
		this.subscriberCount = subscriberCount;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;

		this.isSubscribed = isSubscribed;
	}

	@ApiProperty()
	id: string;

	@ApiProperty()
	userId: string;

	@ApiProperty()
	name: string;

	@ApiProperty({ type: "string", nullable: true })
	description: string | null;

	@ApiProperty()
	subscriberCount: string;

	@ApiProperty()
	createdDate: Date;

	@Exclude()
	updatedDate: Date;

	@ApiPropertyOptional()
	isSubscribed?: boolean;
}
