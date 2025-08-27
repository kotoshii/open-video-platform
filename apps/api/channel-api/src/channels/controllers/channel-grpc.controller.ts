import { Payload } from "@nestjs/microservices";
import { GrpcController } from "@ovp-lib/api/grpc/decorators/grpc-controller.decorator";
import {
	ChannelServiceController,
	ChannelServiceControllerMethods,
	CreateChannelResponse,
} from "@ovp-proto/types/channels";

import { CreateChannelDto } from "~src/channels/dto/create-channel.dto";
import { ChannelAuthDetailsGrpcRequestDto } from "~src/channels/dto/grpc/channel-auth-details-grpc-request.dto";
import { ChannelAuthDetailsGrpcResponseDto } from "~src/channels/dto/grpc/channel-auth-details-grpc-response.dto";
import { CreateChannelGrpcRequestDto } from "~src/channels/dto/grpc/create-channel-grpc-request.dto";
import { CreateChannelGrpcResponseDto } from "~src/channels/dto/grpc/create-channel-grpc-response.dto";
import { DeleteChannelGrpcRequestDto } from "~src/channels/dto/grpc/delete-channel-grpc-request.dto";
import { DeleteChannelGrpcResponseDto } from "~src/channels/dto/grpc/delete-channel-grpc-response.dto";
import { GetChannelGrpcRequestDto } from "~src/channels/dto/grpc/get-channel-grpc-request.dto";
import { GetChannelGrpcResponseDto } from "~src/channels/dto/grpc/get-channel-grpc-response.dto";
import { ChannelService } from "~src/channels/services/channel.service";

@GrpcController()
@ChannelServiceControllerMethods()
export class ChannelGrpcController implements ChannelServiceController {
	constructor(private readonly channelService: ChannelService) {}

	async createChannel(@Payload() body: CreateChannelGrpcRequestDto): Promise<CreateChannelResponse> {
		// TODO: Use mapper or factory method
		const dto = new CreateChannelDto();
		dto.name = body.name;

		const channel = await this.channelService.createChannelOrThrow(body.userId, dto);
		return new CreateChannelGrpcResponseDto(channel);
	}

	async deleteChannel(@Payload() body: DeleteChannelGrpcRequestDto) {
		const { channelId } = body;
		const deletedChannelId = await this.channelService.deleteChannelById(channelId);

		return new DeleteChannelGrpcResponseDto(channelId === deletedChannelId);
	}

	async getChannel(@Payload() body: GetChannelGrpcRequestDto) {
		const { channelId } = body;
		const channel = await this.channelService.getChannelByIdOrThrow(channelId);

		return new GetChannelGrpcResponseDto(channel);
	}

	async validateAuthenticationDetails(
		@Payload() body: ChannelAuthDetailsGrpcRequestDto,
	): Promise<ChannelAuthDetailsGrpcResponseDto> {
		return this.channelService.validateAuthenticationDetails(body);
	}
}
