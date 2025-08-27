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

	async getSubscription(subscriberChannelId: string, subscribedChannelId: string) {
		return this.subscriptionQuery
			.where("subscriberChannelId", "=", subscriberChannelId)
			.where("subscribedChannelId", "=", subscribedChannelId)
			.executeTakeFirst();
	}

	async getSubscriptionsBySubscriberChannelId(
		subscriberChannelId: string,
		filter: GetSubscriptionsFilterDto,
		pagination: PaginationOptionsDto<OrderByKey<Subscription>>,
	) {
		const { offset, limit, orderBy, order } = pagination;

		return this.createFilteredSubscriptionQuery(filter)
			.where("subscriberChannelId", "=", subscriberChannelId)
			.offset(offset)
			.limit(limit)
			.orderBy(orderBy, order)
			.execute();
	}

	async getSubscriptionsBySubscriberChannelIdCount(subscriberChannelId: string, filter: GetSubscriptionsFilterDto) {
		return this.createFilteredSubscriptionQuery(filter)
			.clearSelect()
			.select((eb) => eb.fn.countAll().as("count"))
			.where("subscriberChannelId", "=", subscriberChannelId)
			.executeTakeFirstOrThrow();
	}

	async deleteSubscription(subscriberChannelId: string, subscribedChannelId: string) {
		return this.db
			.deleteFrom("subscriptions")
			.where("subscriberChannelId", "=", subscriberChannelId)
			.where("subscribedChannelId", "=", subscribedChannelId)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	private get subscriptionQuery() {
		return this.db
			.selectFrom("subscriptions")
			.select("id")
			.select("subscriberChannelId")
			.select("subscribedChannelId")
			.select("subscribedChannelName")
			.select("createdDate")
			.select("updatedDate");
	}

	private createFilteredSubscriptionQuery(filter: GetSubscriptionsFilterDto) {
		const { search } = filter;

		const query = this.subscriptionQuery;

		if (search) {
			query.where("subscribedChannelName", "=", search);
		}

		return query;
	}
}
