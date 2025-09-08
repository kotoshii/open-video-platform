import { Module } from "@nestjs/common";
import { GrpcClientsModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/grpc-clients-module-config-builder";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";
import { KafkaProducerService } from "@ovp-lib/api/kafka/services/kafka-producer.service";
import { CHANNELS_PACKAGE_NAME } from "@ovp-proto/types/channels";
import { ProtoPaths } from "@ovp-proto/types/utils/paths";

import { GrpcConfig } from "~src/config/providers/grpc.config";
import { SubscriptionController } from "~src/subscriptions/controllers/subscription.controller";
import { SubscriptionGrpcController } from "~src/subscriptions/controllers/subscription-grpc.controller";
import { SubscriptionKafkaController } from "~src/subscriptions/controllers/subscription-kafka.controller";
import { SubscriptionRepository } from "~src/subscriptions/repositories/subscription.repository";
import { SubscriptionService } from "~src/subscriptions/services/subscription.service";

@Module({
	imports: [
		GrpcClientsModuleConfigBuilderFactory.create(GrpcConfig)
			.addClient(CHANNELS_PACKAGE_NAME, "grpcChannelServiceUrl", ProtoPaths.Channels)
			.build(),
	],
	controllers: [SubscriptionController, SubscriptionGrpcController, SubscriptionKafkaController],
	providers: [SubscriptionService, SubscriptionRepository, KafkaProducerService, KafkaConsumerService],
	exports: [SubscriptionService],
})
export class SubscriptionsModule {}
