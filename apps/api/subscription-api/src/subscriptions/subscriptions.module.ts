import { Module } from "@nestjs/common";
import { GrpcClientsModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/grpc-clients-module-config-builder";
import { CHANNELS_PACKAGE_NAME } from "@ovp-proto/types/channels";
import { ProtoPaths } from "@ovp-proto/types/utils/paths";

import { GrpcConfig } from "~src/config/providers/grpc.config";
import { SubscriptionController } from "~src/subscriptions/controllers/subscription.controller";
import { SubscriptionGrpcController } from "~src/subscriptions/controllers/subscription-grpc.controller";
import { SubscriptionRepository } from "~src/subscriptions/repositories/subscription.repository";
import { SubscriptionService } from "~src/subscriptions/services/subscription.service";

@Module({
	imports: [
		GrpcClientsModuleConfigBuilderFactory.create(GrpcConfig)
			.addClient(CHANNELS_PACKAGE_NAME, "grpcChannelServiceUrl", ProtoPaths.Channels)
			.build(),
	],
	controllers: [SubscriptionController, SubscriptionGrpcController],
	providers: [SubscriptionService, SubscriptionRepository],
	exports: [SubscriptionService],
})
export class SubscriptionsModule {}
