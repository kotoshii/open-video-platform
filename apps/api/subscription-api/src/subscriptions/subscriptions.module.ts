import { Module } from "@nestjs/common";
import { GrpcClientsModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/grpc-clients-module-config-builder";
import { KafkaClientsModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/kafka-clients-module-config-builder";
import { KAFKA_CLIENT } from "@ovp-lib/api/kafka/constants/client-names";
import { CHANNELS_PACKAGE_NAME } from "@ovp-proto/types/channels";
import { ProtoPaths } from "@ovp-proto/types/utils/paths";

import { GrpcConfig } from "~src/config/providers/grpc.config";
import { KafkaConfig } from "~src/config/providers/kafka.config";
import { SubscriptionController } from "~src/subscriptions/controllers/subscription.controller";
import { SubscriptionGrpcController } from "~src/subscriptions/controllers/subscription-grpc.controller";
import { SubscriptionRepository } from "~src/subscriptions/repositories/subscription.repository";
import { SubscriptionService } from "~src/subscriptions/services/subscription.service";

@Module({
	imports: [
		GrpcClientsModuleConfigBuilderFactory.create(GrpcConfig)
			.addClient(CHANNELS_PACKAGE_NAME, "grpcChannelServiceUrl", ProtoPaths.Channels)
			.build(),
		KafkaClientsModuleConfigBuilderFactory.create(KafkaConfig)
			.addClient(KAFKA_CLIENT, "kafkaClientId", "kafkaBrokers")
			.build(),
	],
	controllers: [SubscriptionController, SubscriptionGrpcController],
	providers: [SubscriptionService, SubscriptionRepository],
	exports: [SubscriptionService],
})
export class SubscriptionsModule {}
