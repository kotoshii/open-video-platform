import { Injectable } from "@nestjs/common";
import { Insertable, Kysely, Updateable } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { DB, Video } from "~db/schema";

@Injectable()
export class VideoRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async createVideo(data: Insertable<Video>) {
		return this.db.insertInto("videos").values(data).returningAll().executeTakeFirstOrThrow();
	}

	async getVideoById(id: string) {
		return this.videoQuery.where("id", "=", id).executeTakeFirst();
	}

	async updateVideoById(id: string, data: Updateable<Video>) {
		return this.db.updateTable("videos").set(data).where("id", "=", id).returningAll().executeTakeFirstOrThrow();
	}

	async updateVideosByChannelId(channelId: string, data: Updateable<Video>) {
		return this.db.updateTable("videos").set(data).where("channelId", "=", channelId).execute();
	}

	async deleteVideoById(id: string) {
		return this.db.deleteFrom("videos").where("id", "=", id).returningAll().executeTakeFirstOrThrow();
	}

	private get videoQuery() {
		return this.db
			.selectFrom("videos")
			.select("id")
			.select("channelId")
			.select("channelName")
			.select("title")
			.select("description")
			.select("tags")
			.select("allowComments")
			.select("allowRates")
			.select("selectedThumbnail")
			.select("visibility")
			.select("isPublished")
			.select("isNsfw")
			.select("viewCount")
			.select("likes")
			.select("dislikes")
			.select("createdDate")
			.select("updatedDate");
	}
}
