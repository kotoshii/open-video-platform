import { Injectable } from "@nestjs/common";
import { Insertable, Kysely, Updateable } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { CommentRate, DB } from "~db/schema";

@Injectable()
export class CommentRateRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async createCommentRate(data: Insertable<CommentRate>) {
		return this.db.insertInto("commentRates").values(data).returningAll().executeTakeFirstOrThrow();
	}

	async getCommentRate(commentId: string, channelId: string) {
		return this.commentRateQuery
			.where("commentId", "=", commentId)
			.where("channelId", "=", channelId)
			.executeTakeFirst();
	}

	async getCommentRatesByIdsForChannel(commentIds: string[], channelId: string) {
		return this.commentRateQuery.where("commentId", "in", commentIds).where("channelId", "=", channelId).execute();
	}

	async updateCommentRateById(id: string, data: Updateable<CommentRate>) {
		return this.db.updateTable("commentRates").set(data).where("id", "=", id).returningAll().executeTakeFirstOrThrow();
	}

	async deleteCommentRate(commentId: string, channelId: string) {
		return this.db
			.deleteFrom("commentRates")
			.where("commentId", "=", commentId)
			.where("channelId", "=", channelId)
			.returningAll()
			.executeTakeFirst();
	}

	private get commentRateQuery() {
		return this.db
			.selectFrom("commentRates")
			.select("id")
			.select("commentId")
			.select("channelId")
			.select("type")
			.select("createdDate")
			.select("updatedDate");
	}
}
