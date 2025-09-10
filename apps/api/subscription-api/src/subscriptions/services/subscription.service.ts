import { BadRequestException, Inject, Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { KafkaEventTypes } from "@ovp-lib/api/kafka/constants/event-types";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { SubscriptionCreatedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/subscription-created-kafka-event-payload.dto";
import { SubscriptionDeletedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/subscription-deleted-kafka-event-payload.dto";
import { KafkaProducerService } from "@ovp-lib/api/kafka/services/kafka-producer.service";
import { ChannelKafkaEventPayload } from "@ovp-lib/api/kafka/types/events/channels";
import { PaginatedResponseDto } from "@ovp-lib/api/pagination/dto/paginated-response.dto";
import { PaginationOptionsDto } from "@ovp-lib/api/pagination/dto/pagination-options.dto";
import { jsonParseOrNull } from "@ovp-lib/common/utils/json";
import { SagaBuilder } from "@ovp-lib/common/utils/saga-pattern/saga-builder";
import { CHANNEL_SERVICE_NAME, CHANNELS_PACKAGE_NAME, ChannelServiceClient } from "@ovp-proto/types/channels";
import { EachMessagePayload } from "kafkajs";
import { Selectable } from "kysely";

import { Subscription } from "~db/schema";
import { CreateSubscriptionDto } from "~src/subscriptions/dto/create-subscription.dto";
import { GetSubscriptionDto } from "~src/subscriptions/dto/get-subscription.dto";
import { GetSubscriptionsFilterDto } from "~src/subscriptions/dto/get-subscriptions-filter.dto";
import { SubscriptionRepository } from "~src/subscriptions/repositories/subscription.repository";

@Injectable()
export class SubscriptionService implements OnModuleInit {
	private readonly logger = new Logger(SubscriptionService.name);
	private channelGrpcService: ChannelServiceClient;

	constructor(
		@Inject(CHANNELS_PACKAGE_NAME) private channelClientGrpc: ClientGrpc,
		private readonly kafkaProducerService: KafkaProducerService,
		private readonly subscriptionRepository: SubscriptionRepository,
	) {}

	onModuleInit() {
		this.channelGrpcService = this.channelClientGrpc.getService<ChannelServiceClient>(CHANNEL_SERVICE_NAME);
	}

	async handleChannelEvents(payload: EachMessagePayload) {
		try {
			const message = payload.message.value
				? jsonParseOrNull<ChannelKafkaEventPayload>(payload.message.value.toString())
				: null;

			if (!message) {
				this.logger.error(
					`Kafka event skipped: Invalid message schema for "${KafkaTopic.ChannelEvents}" topic: ${payload.message.value}`,
				);
				return;
			}

			if (message.type === KafkaEventTypes.Channels.ChannelUpdated) {
				await this.subscriptionRepository.updateSubscriptionsByChannelId(message.channelId, {
					channelName: message.name,
				});
			}

			await payload.heartbeat();
		} catch (e) {
			this.logger.error(`Error in "${KafkaTopic.ChannelEvents}" topic handler: ${e}`);
			throw e;
		}
	}

	async createSubscriptionOrThrow(subscriberId: string, dto: CreateSubscriptionDto) {
		const { channelId } = dto;

		if (subscriberId === channelId) {
			throw new BadRequestException("Cannot subscribe to yourself");
		}

		const channel = await this.channelGrpcService.getChannel({ channelId }).toPromise();
		if (!channel?.channel) {
			throw new NotFoundException("Channel not found");
		}

		const existing = await this.getSubscription(subscriberId, channelId);
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
		const deleted = await this.subscriptionRepository.deleteSubscription(subscriberId, channelId);
		if (deleted) {
			await this.kafkaProducerService.emit(
				KafkaTopic.SubscriptionEvents,
				SubscriptionDeletedKafkaEventPayloadDto.createPayload(subscriberId, channelId),
				channelId,
			);
		}
	}

	async getSubscription(subscriberId: string, channelId: string) {
		const subscription = await this.subscriptionRepository.getSubscription(subscriberId, channelId);
		return subscription ? new GetSubscriptionDto(subscription) : null;
	}

	async getPaginatedSubscriptionsBySubscriberId(
		subscriberId: string,
		filter: GetSubscriptionsFilterDto,
		pagination: PaginationOptionsDto<Selectable<Subscription>>,
	): Promise<PaginatedResponseDto<GetSubscriptionDto>> {
		const data = await this.subscriptionRepository.getSubscriptionsBySubscriberId(subscriberId, filter, pagination);
		const { count } = await this.subscriptionRepository.getSubscriptionsBySubscriberIdCount(subscriberId, filter);

		const dto = data.map((item) => new GetSubscriptionDto(item));

		return new PaginatedResponseDto(dto, pagination, Number(count));
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
					await this.kafkaProducerService.emit(
						KafkaTopic.SubscriptionEvents,
						SubscriptionCreatedKafkaEventPayloadDto.createPayload(input.subscriberId, input.channelId),
						input.channelId,
					);
				},
				async () => {},
			)
			.execute();
	}
}
