import { Inject, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { USER_SERVICE_NAME, USERS_PACKAGE_NAME, UserServiceClient } from "@ovp-proto/types/users";
import { Insertable } from "kysely";

import { Channel } from "~db/schema";
import { CreateChannelDto } from "~src/channels/dto/create-channel.dto";
import { GetChannelDto } from "~src/channels/dto/get-channel.dto";
import { ChannelRepository } from "~src/channels/repositories/channel.repository";

@Injectable()
export class ChannelService implements OnModuleInit {
	private userGrpcService: UserServiceClient;

	constructor(
		@Inject(USERS_PACKAGE_NAME) private clientGrpc: ClientGrpc,
		private readonly channelRepository: ChannelRepository,
	) {}

	onModuleInit() {
		this.userGrpcService = this.clientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
	}

	async getChannelByIdOrThrow(channelId: string) {
		const channel = await this.channelRepository.getChannelById(channelId);

		if (!channel) {
			throw new NotFoundException("Channel not found");
		}

		return new GetChannelDto(channel);
	}

	async createChannelOrThrow(userId: string, dto: CreateChannelDto) {
		const userExistsResponse = await this.userGrpcService.userExists({ userId }).toPromise();
		if (!userExistsResponse?.exists) {
			throw new NotFoundException("Could not create channel: user not found");
		}

		const { name, description } = dto;

		const data: Insertable<Channel> = {
			userId,
			name,
			description,
		};

		const { id: channelId } = await this.channelRepository.createChannel(data);

		return this.getChannelByIdOrThrow(channelId);
	}
}
