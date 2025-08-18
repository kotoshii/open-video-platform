import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { USERS_PACKAGE_NAME } from "@ovp-proto/types/users";
import { ProtoPaths } from "@ovp-proto/types/utils/paths";

import { ChannelController } from "~src/channels/controllers/channel.controller";
import { ChannelGrpcController } from "~src/channels/controllers/channel-grpc.controller";
import { ChannelRepository } from "~src/channels/repositories/channel.repository";
import { ChannelService } from "~src/channels/services/channel.service";
import { GrpcConfig } from "~src/config/providers/grpc.config";

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: USERS_PACKAGE_NAME,
				useFactory: (grpcConfig: GrpcConfig) => ({
					transport: Transport.GRPC,
					options: {
						package: USERS_PACKAGE_NAME,
						url: grpcConfig.grpcUserServiceUrl,
						protoPath: ProtoPaths.Users,
					},
				}),
				inject: [GrpcConfig],
			},
		]),
	],
	controllers: [ChannelController, ChannelGrpcController],
	providers: [ChannelService, ChannelRepository],
})
export class ChannelsModule {}
