import { Module } from "@nestjs/common";
import { GrpcClientsModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/grpc-clients-module-config-builder";
import { KafkaProducerService } from "@ovp-lib/api/kafka/services/kafka-producer.service";
import { COMMENTS_PACKAGE_NAME } from "@ovp-proto/types/comments";
import { ProtoPaths } from "@ovp-proto/types/utils/paths";

import { CommentRateController } from "~src/comment-rates/controllers/comment-rate.controller";
import { CommentRateRepository } from "~src/comment-rates/repositories/comment-rate.repository";
import { CommentRateService } from "~src/comment-rates/services/comment-rate.service";
import { GrpcConfig } from "~src/config/providers/grpc.config";

@Module({
	imports: [
		GrpcClientsModuleConfigBuilderFactory.create(GrpcConfig)
			.addClient(COMMENTS_PACKAGE_NAME, "grpcCommentServiceUrl", ProtoPaths.Comments)
			.build(),
	],
	controllers: [CommentRateController],
	providers: [CommentRateRepository, CommentRateService, KafkaProducerService],
	exports: [CommentRateService],
})
export class CommentRatesModule {}
