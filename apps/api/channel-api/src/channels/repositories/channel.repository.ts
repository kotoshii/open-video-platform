import { Injectable } from "@nestjs/common";
import { Insertable, Kysely, Updateable } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { Channel, DB } from "~db/schema";

@Injectable()
export class ChannelRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async getChannelById(channelId: string) {
		return this.channelQuery.where("id", "=", channelId).executeTakeFirst();
	}

	async createChannel(data: Insertable<Channel>) {
		return this.db.insertInto("channels").values(data).returningAll().executeTakeFirstOrThrow();
	}

	async deleteChannelById(channelId: string) {
		return this.db.deleteFrom("channels").where("id", "=", channelId).returning("id").executeTakeFirstOrThrow();
	}

	async updateChannelById(channelId: string, data: Updateable<Channel>) {
		return this.db
			.updateTable("channels")
			.set(data)
			.where("id", "=", channelId)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	private get channelQuery() {
		return this.db
			.selectFrom("channels")
			.select("id")
			.select("userId")
			.select("name")
			.select("description")
			.select("subscriberCount")
			.select("createdDate")
			.select("updatedDate");
	}
}
