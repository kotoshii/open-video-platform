import { Module } from "@nestjs/common";
import { GrpcClientsModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/grpc-clients-module-config-builder";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";
import { KafkaProducerService } from "@ovp-lib/api/kafka/services/kafka-producer.service";
import { CHANNELS_PACKAGE_NAME } from "@ovp-proto/types/channels";
import { USERS_PACKAGE_NAME } from "@ovp-proto/types/users";
import { ProtoPaths } from "@ovp-proto/types/utils/paths";

import { GrpcConfig } from "~src/config/providers/grpc.config";
import { VideoController } from "~src/videos/controllers/video.controller";
import { VideoGrpcController } from "~src/videos/controllers/video-grpc.controller";
import { VideoKafkaController } from "~src/videos/controllers/video-kafka.controller";
import { VideoRepository } from "~src/videos/repositories/video.repository";
import { VideoService } from "~src/videos/services/video.service";

@Module({
	imports: [
		GrpcClientsModuleConfigBuilderFactory.create(GrpcConfig)
			.addClient(USERS_PACKAGE_NAME, "grpcUserServiceUrl", ProtoPaths.Users)
			.addClient(CHANNELS_PACKAGE_NAME, "grpcChannelServiceUrl", ProtoPaths.Channels)
			.build(),
	],
	controllers: [VideoController, VideoGrpcController, VideoKafkaController],
	providers: [VideoRepository, VideoService, KafkaProducerService, KafkaConsumerService],
	exports: [VideoService],
})
export class VideosModule {}
