import { Inject, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { USER_SERVICE_NAME, USERS_PACKAGE_NAME, UserServiceClient } from "@ovp-proto/types/users";

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

		const { name, description } = dto;

		const { id: channelId } = await this.channelRepository.createChannel({
			userId,
			name,
			description,
		});
		// todo remove extra db query
		return this.getChannelByIdOrThrow(channelId);
	}

	async updateCurrentChannelByIdOrThrow(channelId: string, dto: UpdateChannelDto) {
		const channel = await this.channelRepository.getChannelById(channelId);

		if (!channel) {
			throw new UnauthorizedException();
		}

		const { name, description } = dto;

		const updatedChannel = await this.channelRepository.updateChannelById(channelId, { name, description });

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
}
