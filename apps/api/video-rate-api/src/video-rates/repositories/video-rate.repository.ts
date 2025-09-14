import { Injectable } from "@nestjs/common";
import { Insertable, Kysely, Updateable } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { DB, VideoRate } from "~db/schema";

@Injectable()
export class VideoRateRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async createVideoRate(data: Insertable<VideoRate>) {
		return this.db.insertInto("videoRates").values(data).returningAll().executeTakeFirstOrThrow();
	}

	async getVideoRate(videoId: string, channelId: string) {
		return this.videoRateQuery.where("videoId", "=", videoId).where("channelId", "=", channelId).executeTakeFirst();
	}

	async updateVideoRateById(id: string, data: Updateable<VideoRate>) {
		return this.db.updateTable("videoRates").set(data).where("id", "=", id).returningAll().executeTakeFirstOrThrow();
	}

	async deleteVideoRate(videoId: string, channelId: string) {
		return this.db
			.deleteFrom("videoRates")
			.where("videoId", "=", videoId)
			.where("channelId", "=", channelId)
			.returningAll()
			.executeTakeFirst();
	}

	private get videoRateQuery() {
		return this.db
			.selectFrom("videoRates")
			.select("id")
			.select("videoId")
			.select("channelId")
			.select("type")
			.select("createdDate")
			.select("updatedDate");
	}
}
