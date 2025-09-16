import { Injectable } from "@nestjs/common";
import { Kysely, sql } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { DB } from "~db/schema";

@Injectable()
export class VideoRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async updateCommentCounts(videoIds: string[], deltas: number[]) {
		const videoIdArray = `{${videoIds.map((videoId) => `"${videoId}"`).join(",")}}`;
		const deltaArray = `{${deltas.map((delta) => delta).join(",")}}`;

		const query = sql`
        update videos as to_t
        set comment_count = greatest(0, to_t.comment_count + from_t.delta)
        from (
                 select unnest(${videoIdArray}::uuid[]) as video_id,
                        unnest(${deltaArray}::int[]) as delta
             ) as from_t
        where to_t.id = from_t.video_id;
    `;

		await this.db.transaction().execute(async (trx) => {
			await query.execute(trx);
		});
	}
}
