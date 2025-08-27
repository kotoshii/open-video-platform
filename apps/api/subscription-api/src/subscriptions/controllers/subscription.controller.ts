import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse } from "@nestjs/swagger";
import { ChannelId } from "@ovp-lib/api/auth/decorators/channel-id.decorator";
import { NestErrorResponseDto } from "@ovp-lib/api/common/dto/nest-error-response.dto";
import { OrderByKey } from "@ovp-lib/api/kysely/types/order-by-key";
import { ApiPaginatedResponse } from "@ovp-lib/api/pagination/decorators/api-paginated-response.decorator";
import { Pagination } from "@ovp-lib/api/pagination/decorators/pagination.decorator";
import { PaginationOptionsDto } from "@ovp-lib/api/pagination/dto/pagination-options.dto";
import { SortOrder } from "@ovp-lib/common/constants/sort-order";

import { Subscription } from "~db/schema";
import { CreateSubscriptionDto } from "~src/subscriptions/dto/create-subscription.dto";
import { GetSubscriptionDto } from "~src/subscriptions/dto/get-subscription.dto";
import { GetSubscriptionsFilterDto } from "~src/subscriptions/dto/get-subscriptions-filter.dto";
import { SubscriptionService } from "~src/subscriptions/services/subscription.service";

@Controller("subscriptions")
export class SubscriptionController {
	constructor(private readonly subscriptionService: SubscriptionService) {}

	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: GetSubscriptionDto, description: "Subscription created or already exists" })
	@ApiNotFoundResponse({ type: NestErrorResponseDto, description: "Channel not found" })
	@ApiBadRequestResponse({ type: NestErrorResponseDto, description: "Params validation failed" })
	@Post()
	async createSubscription(@ChannelId() subscriberChannelId: string, @Body() body: CreateSubscriptionDto) {
		return this.subscriptionService.createSubscriptionOrThrow(subscriberChannelId, body);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiNoContentResponse({ description: "Subscription successfully deleted or it didn't even exist" })
	@Delete(":channelId")
	async deleteSubscription(@ChannelId() subscriberChannelId: string, @Param("channelId") subscribedChannelId: string) {
		return this.subscriptionService.deleteSubscription(subscriberChannelId, subscribedChannelId);
	}

	@ApiPaginatedResponse(GetSubscriptionDto, {
		description: "List of current user (channel) subscriptions",
	})
	@Get("current")
	async getCurrentChannelSubscriptions(
		@ChannelId() subscriberChannelId: string,
		@Query() filter: GetSubscriptionsFilterDto,
		@Pagination<OrderByKey<Subscription>>({ order: SortOrder.Asc, orderBy: "subscribedChannelName", limit: 50 })
		pagination: PaginationOptionsDto<OrderByKey<Subscription>>,
	) {
		return this.subscriptionService.getPaginatedSubscriptionsBySubscriberId(subscriberChannelId, filter, pagination);
	}
}
