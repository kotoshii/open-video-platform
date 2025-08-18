import { Payload } from "@nestjs/microservices";
import { GrpcController } from "@ovp-lib/api/common/decorators/grpc-controller.decorator";
import {
	ChannelServiceController,
	ChannelServiceControllerMethods,
	CreateChannelResponse,
} from "@ovp-proto/types/channels";

import { CreateChannelDto } from "~src/channels/dto/create-channel.dto";
import { CreateChannelGrpcRequestDto } from "~src/channels/dto/grpc/create-channel-grpc-request.dto";
import { CreateChannelGrpcResponseDto } from "~src/channels/dto/grpc/create-channel-grpc-response.dto";
import { ChannelService } from "~src/channels/services/channel.service";

@GrpcController()
@ChannelServiceControllerMethods()
export class ChannelGrpcController implements ChannelServiceController {
	constructor(private readonly channelService: ChannelService) {}

	async createChannel(@Payload() body: CreateChannelGrpcRequestDto): Promise<CreateChannelResponse> {
		const dto = new CreateChannelDto();
		dto.name = body.name;

		const channel = await this.channelService.createChannelOrThrow(body.userId, dto);
		return new CreateChannelGrpcResponseDto(channel);
	}
}
