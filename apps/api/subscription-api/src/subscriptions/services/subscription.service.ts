import { Inject, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc, ClientKafka } from "@nestjs/microservices";
import { KAFKA_CLIENT } from "@ovp-lib/api/kafka/constants/client-names";
import { SubscriptionCreatedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/subscription-created-kafka-event-payload.dto";
import { SubscriptionDeletedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/subscription-deleted-kafka-event-payload.dto";
import { OrderByKey } from "@ovp-lib/api/kysely/types/order-by-key";
import { PaginatedResponseDto } from "@ovp-lib/api/pagination/dto/paginated-response.dto";
import { PaginationOptionsDto } from "@ovp-lib/api/pagination/dto/pagination-options.dto";
import { SagaBuilder } from "@ovp-lib/common/utils/saga-pattern/saga-builder";
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
		@Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
		private readonly subscriptionRepository: SubscriptionRepository,
	) {}

	onModuleInit() {
		this.channelGrpcService = this.channelClientGrpc.getService<ChannelServiceClient>(CHANNEL_SERVICE_NAME);
	}

	async createSubscriptionOrThrow(subscriberId: string, dto: CreateSubscriptionDto) {
		const { channelId } = dto;

		const channel = await this.channelGrpcService.getChannel({ channelId }).toPromise();
		if (!channel?.channel) {
			throw new NotFoundException("Channel not found");
		}

		const existing = this.getSubscription(subscriberId, channelId);
		if (existing) {
			return existing;
		}

		const channelName = channel.channel.name;

		const sagaResults = await this.createSubscriptionSaga(subscriberId, channelId, channelName);

		if (sagaResults.error) {
			throw sagaResults.error;
		}

		const subscription = sagaResults.results?.createSubscription || null;

		if (!subscription) {
			throw new Error(`Failed to create subscription: subscriberId ${subscriberId}, channelId ${channelId}`);
		}

		return new GetSubscriptionDto(subscription);
	}

	async deleteSubscription(subscriberId: string, channelId: string) {
		await this.subscriptionRepository.deleteSubscription(subscriberId, channelId);
		await this.kafkaClient
			.emit(
				SubscriptionDeletedKafkaEventPayloadDto.Topic,
				SubscriptionDeletedKafkaEventPayloadDto.createPayload(subscriberId, channelId),
			)
			.toPromise();
	}

	async getSubscription(subscriberId: string, channelId: string) {
		const subscription = await this.subscriptionRepository.getSubscription(subscriberId, channelId);
		return subscription ? new GetSubscriptionDto(subscription) : null;
	}

	async getPaginatedSubscriptionsBySubscriberId(
		subscriberId: string,
		filter: GetSubscriptionsFilterDto,
		pagination: PaginationOptionsDto<OrderByKey<Subscription>>,
	): Promise<PaginatedResponseDto<GetSubscriptionDto>> {
		const data = await this.subscriptionRepository.getSubscriptionsBySubscriberId(subscriberId, filter, pagination);
		const { count } = await this.subscriptionRepository.getSubscriptionsBySubscriberIdCount(subscriberId, filter);

		return new PaginatedResponseDto(data, pagination, Number(count));
	}

	private async createSubscriptionSaga(subscriberId: string, channelId: string, channelName: string) {
		return SagaBuilder.create(`create-subscription-${subscriberId}-to-${channelId}`)
			.addStep(
				"createSubscription",
				async () => {
					return this.subscriptionRepository.createSubscription({
						subscriberId,
						channelId,
						channelName,
					});
				},
				async (_, output) => {
					await this.subscriptionRepository.deleteSubscription(output.subscriberId, output.channelId);
				},
			)
			.addStep(
				"sendSubscriptionCreatedKafkaEvent",
				async (input) => {
					await this.kafkaClient
						.emit(
							SubscriptionCreatedKafkaEventPayloadDto.Topic,
							SubscriptionCreatedKafkaEventPayloadDto.createPayload(input.subscriberId, input.channelId),
						)
						.toPromise();
				},
				async () => {},
			)
			.execute();
	}
}
