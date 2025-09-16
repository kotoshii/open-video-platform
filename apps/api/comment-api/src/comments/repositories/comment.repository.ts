import { Injectable } from "@nestjs/common";
import { Insertable, Kysely, Updateable } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { Comment, DB } from "~db/schema";

@Injectable()
export class CommentRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async createComment(data: Insertable<Comment>) {
		return this.db.transaction().execute(async (trx) => {
			const inserted = await trx.insertInto("comments").values(data).returningAll().executeTakeFirstOrThrow();

			if (data.parentId) {
				await trx
					.updateTable("comments")
					.set((eb) => ({
						replyCount: eb("replyCount", "+", eb.val(1).$castTo<"bigint">()),
					}))
					.where("id", "=", data.parentId)
					.executeTakeFirstOrThrow();
			}

			return inserted;
		});
	}

	async getCommentById(commentId: string) {
		return this.commentQuery.where("id", "=", commentId).executeTakeFirst();
	}

	async updateCommentById(commentId: string, data: Updateable<Comment>) {
		return this.db
			.updateTable("comments")
			.set(data)
			.where("id", "=", commentId)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	async deleteCommentById(commentId: string) {
		return this.db.deleteFrom("comments").where("id", "=", commentId).returningAll().executeTakeFirst();
	}

	private get commentQuery() {
		return this.db
			.selectFrom("comments")
			.select("id")
			.select("videoId")
			.select("channelId")
			.select("channelName")
			.select("content")
			.select("parentId")
			.select("likes")
			.select("dislikes")
			.select("replyCount")
			.select("createdDate")
			.select("updatedDate");
	}
}

// getCommentsByVideoId
// getRepliesByCommentId
