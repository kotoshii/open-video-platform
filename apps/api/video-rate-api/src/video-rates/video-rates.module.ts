import { Module } from "@nestjs/common";
import { GrpcClientsModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/grpc-clients-module-config-builder";
import { KafkaProducerService } from "@ovp-lib/api/kafka/services/kafka-producer.service";
import { ProtoPaths } from "@ovp-proto/types/utils/paths";
import { VIDEOS_PACKAGE_NAME } from "@ovp-proto/types/videos";

import { GrpcConfig } from "~src/config/providers/grpc.config";
import { VideoRateController } from "~src/video-rates/controllers/video-rate.controller";
import { VideoRateRepository } from "~src/video-rates/repositories/video-rate.repository";
import { VideoRateService } from "~src/video-rates/services/video-rate.service";

@Module({
	imports: [
		GrpcClientsModuleConfigBuilderFactory.create(GrpcConfig)
			.addClient(VIDEOS_PACKAGE_NAME, "grpcVideoServiceUrl", ProtoPaths.Videos)
			.build(),
	],
	controllers: [VideoRateController],
	providers: [VideoRateRepository, VideoRateService, KafkaProducerService],
	exports: [VideoRateService],
})
export class VideoRatesModule {}
