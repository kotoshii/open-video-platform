import { Injectable } from "@nestjs/common";
import { VideoRateType } from "@ovp-lib/api/kafka/types/events/video-rates";
import { Kysely, sql } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { DB } from "~db/schema";

@Injectable()
export class VideoRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async updateRateCounts(videoIds: string[], rateTypes: VideoRateType[], deltas: number[]) {
		const videoIdArray = `{${videoIds.map((videoId) => `"${videoId}"`).join(",")}}`;
		const rateTypeArray = `{${rateTypes.map((rateType) => `"${rateType}"`).join(",")}}`;
		const deltaArray = `{${deltas.map((delta) => delta).join(",")}}`;

		const query = sql`
        update videos as to_t
        set
            likes = greatest(0, to_t.likes + coalesce(from_t.likes_delta, 0)),
            dislikes = greatest(0, to_t.dislikes + coalesce(from_t.dislikes_delta, 0))
        from (
                 select
                     video_id,
                     sum(case when rate_type = 'like' then delta else 0 end) as likes_delta,
                     sum(case when rate_type = 'dislike' then delta else 0 end) as dislikes_delta
                 from (
                          select
                              unnest(${videoIdArray}::uuid[]) as video_id,
                              unnest(${rateTypeArray}::text[]) as rate_type,
                              unnest(${deltaArray}::int[]) as delta
                      ) as raw
                 group by video_id
             ) as from_t
        where to_t.id = from_t.video_id;
    `;

		await this.db.transaction().execute(async (trx) => {
			await query.execute(trx);
		});
	}
}
