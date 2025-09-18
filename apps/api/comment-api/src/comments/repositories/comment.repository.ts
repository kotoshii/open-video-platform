import { Injectable } from "@nestjs/common";
import { Insertable, Kysely, Updateable } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { Comment, DB } from "~db/schema";
import { GetCommentsPaginationOptionsDto } from "~src/comments/dto/get-comments-pagination-options.dto";

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

	async getCommentsByVideoId(videoId: string, pagination: GetCommentsPaginationOptionsDto) {
		const { offset, limit, orderBy, order } = pagination;

		return this.commentQuery
			.where("videoId", "=", videoId)
			.offset(offset)
			.limit(limit)
			.orderBy(orderBy, order)
			.execute();
	}

	async getCommentsByVideoIdCount(videoId: string) {
		return this.db
			.selectFrom("comments")
			.select((eb) => eb.fn.countAll<string>().as("count"))
			.where("videoId", "=", videoId)
			.executeTakeFirstOrThrow()
			.then((result) => Number(result.count) || 0);
	}

	async updateCommentById(commentId: string, data: Updateable<Comment>) {
		return this.db
			.updateTable("comments")
			.set(data)
			.where("id", "=", commentId)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	updateCommentsByChannelId(channelId: string, data: Updateable<Comment>) {
		return this.db.updateTable("comments").set(data).where("channelId", "=", channelId).execute();
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
