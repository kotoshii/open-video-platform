import { Inject, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { OrderByKey } from "@ovp-lib/api/kysely/types/order-by-key";
import { PaginatedResponseDto } from "@ovp-lib/api/pagination/dto/paginated-response.dto";
import { PaginationOptionsDto } from "@ovp-lib/api/pagination/dto/pagination-options.dto";
import { CHANNEL_SERVICE_NAME, CHANNELS_PACKAGE_NAME, ChannelServiceClient } from "@ovp-proto/types/channels";

import { Subscription } from "~db/schema";
import { CreateSubscriptionDto } from "~src/subscriptions/dto/create-subscription.dto";
import { GetSubscriptionDto } from "~src/subscriptions/dto/get-subscription.dto";
import { GetSubscriptionsFilterDto } from "~src/subscriptions/dto/get-subscriptions-filter.dto";
import { SubscriptionRepository } from "~src/subscriptions/repositories/subscription.repository";

@Injectable()
export class SubscriptionService implements OnModuleInit {
	private channelGrpcService: ChannelServiceClient;

	constructor(
		@Inject(CHANNELS_PACKAGE_NAME) private channelClientGrpc: ClientGrpc,
		private readonly subscriptionRepository: SubscriptionRepository,
	) {}

	onModuleInit() {
		this.channelGrpcService = this.channelClientGrpc.getService<ChannelServiceClient>(CHANNEL_SERVICE_NAME);
	}

	async createSubscriptionOrThrow(subscriberChannelId: string, dto: CreateSubscriptionDto) {
		const { subscribedChannelId } = dto;

		const subscribedChannel = await this.channelGrpcService.getChannel({ channelId: subscribedChannelId }).toPromise();
		if (!subscribedChannel?.channel) {
			throw new NotFoundException("Channel not found");
		}

		const existing = this.getSubscription(subscriberChannelId, subscribedChannelId);
		if (existing) {
			return existing;
		}

		const subscribedChannelName = subscribedChannel.channel.name;
		const subscription = await this.subscriptionRepository.createSubscription({
			subscriberChannelId,
			subscribedChannelId,
			subscribedChannelName,
		});

		return new GetSubscriptionDto(subscription);
	}

	async deleteSubscription(subscriberChannelId: string, subscribedChannelId: string) {
		await this.subscriptionRepository.deleteSubscription(subscriberChannelId, subscribedChannelId);
	}

	async getSubscription(subscriberChannelId: string, subscribedChannelId: string) {
		const subscription = await this.subscriptionRepository.getSubscription(subscriberChannelId, subscribedChannelId);
		return subscription ? new GetSubscriptionDto(subscription) : null;
	}

	async getPaginatedSubscriptionsBySubscriberId(
		subscriberChannelId: string,
		filter: GetSubscriptionsFilterDto,
		pagination: PaginationOptionsDto<OrderByKey<Subscription>>,
	): Promise<PaginatedResponseDto<GetSubscriptionDto>> {
		const data = await this.subscriptionRepository.getSubscriptionsBySubscriberChannelId(
			subscriberChannelId,
			filter,
			pagination,
		);
		const { count } = await this.subscriptionRepository.getSubscriptionsBySubscriberChannelIdCount(
			subscriberChannelId,
			filter,
		);

		return new PaginatedResponseDto(data, pagination, Number(count));
	}
}
