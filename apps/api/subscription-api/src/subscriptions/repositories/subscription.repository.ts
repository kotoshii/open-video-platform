import { Injectable } from "@nestjs/common";
import { OrderByKey } from "@ovp-lib/api/kysely/types/order-by-key";
import { PaginationOptionsDto } from "@ovp-lib/api/pagination/dto/pagination-options.dto";
import { Insertable, Kysely } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { DB, Subscription } from "~db/schema";
import { GetSubscriptionsFilterDto } from "~src/subscriptions/dto/get-subscriptions-filter.dto";

@Injectable()
export class SubscriptionRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async createSubscription(data: Insertable<Subscription>) {
		return this.db.insertInto("subscriptions").values(data).returningAll().executeTakeFirstOrThrow();
	}

	async getSubscription(subscriberId: string, channelId: string) {
		return this.subscriptionQuery
			.where("subscriberId", "=", subscriberId)
			.where("channelId", "=", channelId)
			.executeTakeFirst();
	}

	async getSubscriptionsBySubscriberId(
		subscriberId: string,
		filter: GetSubscriptionsFilterDto,
		pagination: PaginationOptionsDto<OrderByKey<Subscription>>,
	) {
		const { offset, limit, orderBy, order } = pagination;

		return this.createFilteredSubscriptionQuery(filter)
			.where("subscriberId", "=", subscriberId)
			.offset(offset)
			.limit(limit)
			.orderBy(orderBy, order)
			.execute();
	}

	async getSubscriptionsBySubscriberIdCount(subscriberId: string, filter: GetSubscriptionsFilterDto) {
		return this.createFilteredSubscriptionQuery(filter)
			.clearSelect()
			.select((eb) => eb.fn.countAll().as("count"))
			.where("subscriberId", "=", subscriberId)
			.executeTakeFirstOrThrow();
	}

	async deleteSubscription(subscriberId: string, channelId: string) {
		return this.db
			.deleteFrom("subscriptions")
			.where("subscriberId", "=", subscriberId)
			.where("channelId", "=", channelId)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	private get subscriptionQuery() {
		return this.db
			.selectFrom("subscriptions")
			.select("id")
			.select("subscriberId")
			.select("channelId")
			.select("channelName")
			.select("createdDate")
			.select("updatedDate");
	}

	private createFilteredSubscriptionQuery(filter: GetSubscriptionsFilterDto) {
		const { search } = filter;

		const query = this.subscriptionQuery;

		if (search) {
			query.where("channelName", "ilike", search);
		}

		return query;
	}
}
