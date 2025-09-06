import { Injectable } from "@nestjs/common";
import { Kysely, sql } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { DB } from "~db/schema";

@Injectable()
export class ChannelRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async updateSubscriberCounts(channelIds: string[], deltas: number[]) {
		const channelIdArray = `{${channelIds.map((channelId) => `"${channelId}"`).join(",")}}`;
		const deltaArray = `{${deltas.map((delta) => delta).join(",")}}`;

		const query = sql`
        update channels as to_t
        set subscriber_count = greatest(0, to_t.subscriber_count + from_t.delta)
        from (
                 select unnest(${channelIdArray}::uuid[]) as channel_id,
                        unnest(${deltaArray}::int[]) as delta
             ) as from_t
        where to_t.id = from_t.channel_id;
    `;

		await this.db.transaction().execute(async (trx) => {
			await query.execute(trx);
		});
	}
}
