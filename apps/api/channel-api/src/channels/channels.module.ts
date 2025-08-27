import { Module } from "@nestjs/common";
import { GrpcClientsModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/grpc-clients-module-config-builder";
import { USERS_PACKAGE_NAME } from "@ovp-proto/types/users";
import { ProtoPaths } from "@ovp-proto/types/utils/paths";

import { ChannelController } from "~src/channels/controllers/channel.controller";
import { ChannelGrpcController } from "~src/channels/controllers/channel-grpc.controller";
import { ChannelRepository } from "~src/channels/repositories/channel.repository";
import { ChannelService } from "~src/channels/services/channel.service";
import { GrpcConfig } from "~src/config/providers/grpc.config";

@Module({
	imports: [
		GrpcClientsModuleConfigBuilderFactory.create(GrpcConfig)
			.addClient(USERS_PACKAGE_NAME, "grpcUserServiceUrl", ProtoPaths.Users)
			.build(),
	],
	controllers: [ChannelController, ChannelGrpcController],
	providers: [ChannelService, ChannelRepository],
})
export class ChannelsModule {}
