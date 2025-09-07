import { Inject, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { ChannelCreatedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/channel-created-kafka-event-payload.dto";
import { ChannelUpdatedKafkaEventPayloadDto } from "@ovp-lib/api/kafka/dto/channel-updated-kafka-event-payload.dto";
import { KafkaProducerService } from "@ovp-lib/api/kafka/services/kafka-producer.service";
import { SagaBuilder } from "@ovp-lib/common/utils/saga-pattern/saga-builder";
import { USER_SERVICE_NAME, USERS_PACKAGE_NAME, UserServiceClient } from "@ovp-proto/types/users";
import { Selectable } from "kysely";

import { Channel } from "~db/schema";
import { CreateChannelDto } from "~src/channels/dto/create-channel.dto";
import { GetChannelDto } from "~src/channels/dto/get-channel.dto";
import { ChannelAuthDetailsGrpcRequestDto } from "~src/channels/dto/grpc/channel-auth-details-grpc-request.dto";
import { ChannelAuthDetailsGrpcResponseDto } from "~src/channels/dto/grpc/channel-auth-details-grpc-response.dto";
import { UpdateChannelDto } from "~src/channels/dto/update-channel.dto";
import { ChannelRepository } from "~src/channels/repositories/channel.repository";

@Injectable()
export class ChannelService implements OnModuleInit {
	private userGrpcService: UserServiceClient;

	constructor(
		@Inject(USERS_PACKAGE_NAME) private clientGrpc: ClientGrpc,
		private readonly channelRepository: ChannelRepository,
		private readonly kafkaProducerService: KafkaProducerService,
	) {}

	onModuleInit() {
		this.userGrpcService = this.clientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
	}

	async deleteChannelById(channelId: string) {
		const { id: deletedChannelId } = await this.channelRepository.deleteChannelById(channelId);
		return deletedChannelId;
	}

	async getChannelByIdOrThrow(channelId: string) {
		const channel = await this.channelRepository.getChannelById(channelId);

		if (!channel) {
			throw new NotFoundException("Channel not found");
		}

		return new GetChannelDto(channel);
	}

	async getCurrentChannelByIdOrThrow(channelId: string) {
		const channel = await this.channelRepository.getChannelById(channelId);

		if (!channel) {
			throw new UnauthorizedException();
		}

		return new GetChannelDto(channel);
	}

	async createChannelOrThrow(userId: string, dto: CreateChannelDto) {
		const userExistsResponse = await this.userGrpcService.userExists({ userId }).toPromise();

		if (!userExistsResponse?.exists) {
			throw new NotFoundException("Could not create channel: user not found");
		}

		const { name, description = null } = dto;

		const sagaResult = await this.createChannelSaga(userId, name, description);

		if (sagaResult.error) {
			throw sagaResult.error;
		}

		const channel = sagaResult.results?.createChannel || null;

		if (!channel) {
			throw new Error(`Failed to create channel: userId ${userId}, name ${name}, description ${description}`);
		}

		return new GetChannelDto(channel);
	}

	async updateCurrentChannelByIdOrThrow(channelId: string, dto: UpdateChannelDto) {
		const channel = await this.channelRepository.getChannelById(channelId);

		if (!channel) {
			throw new UnauthorizedException();
		}

		const { name, description } = dto;

		const sagaResult = await this.updateChannelSaga(channel, name, description);

		if (sagaResult.error) {
			throw sagaResult.error;
		}

		const updatedChannel = sagaResult.results?.updateChannel || null;

		if (!updatedChannel) {
			throw new Error(`Failed to update channel: channelId ${channelId}, name ${name}, description ${description}`);
		}

		return new GetChannelDto(updatedChannel);
	}

	async validateAuthenticationDetails(
		body: ChannelAuthDetailsGrpcRequestDto,
	): Promise<ChannelAuthDetailsGrpcResponseDto> {
		const { userId, channelId } = body;

		const channel = await this.channelRepository.getChannelById(channelId);

		if (channel) {
			return new ChannelAuthDetailsGrpcResponseDto(channel.userId === userId, channelId);
		}

		return new ChannelAuthDetailsGrpcResponseDto(false);
	}

	private async createChannelSaga(userId: string, name: string, description: string | null) {
		return SagaBuilder.create(`create-channel-for-user-${userId}`)
			.addStep(
				"createChannel",
				async () => {
					return this.channelRepository.createChannel({ userId, name, description });
				},
				async (_, output) => {
					await this.channelRepository.deleteChannelById(output.id);
				},
			)
			.addStep(
				"sendChannelCreatedKafkaEvent",
				async (input) => {
					await this.kafkaProducerService.emit(
						KafkaTopic.ChannelEvents,
						ChannelCreatedKafkaEventPayloadDto.createPayload(
							input.id,
							input.userId,
							input.name,
							input.description,
							input.subscriberCount,
							input.createdDate,
						),
					);
				},
				async () => {},
			)
			.execute();
	}

	private async updateChannelSaga(channel: Selectable<Channel> | GetChannelDto, name?: string, description?: string) {
		return SagaBuilder.create(`update-channel-${channel.id}`)
			.addStep(
				"updateChannel",
				async () => {
					return this.channelRepository.updateChannelById(channel.id, { name, description });
				},
				async () => {
					// set previous values
					await this.channelRepository.updateChannelById(channel.id, {
						name: channel.name,
						description: channel.description,
					});
				},
			)
			.addStep(
				"sendChannelUpdatedKafkaEvent",
				async (input) => {
					await this.kafkaProducerService.emit(
						KafkaTopic.ChannelEvents,
						ChannelUpdatedKafkaEventPayloadDto.createPayload(input.id, input.name, input.description),
					);
				},
				async () => {},
			)
			.execute();
	}
}
