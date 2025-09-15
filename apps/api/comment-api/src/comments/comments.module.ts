import { Global, Module } from "@nestjs/common";
import { GrpcClientsModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/grpc-clients-module-config-builder";
import { KafkaProducerService } from "@ovp-lib/api/kafka/services/kafka-producer.service";
import { CHANNELS_PACKAGE_NAME } from "@ovp-proto/types/channels";
import { ProtoPaths } from "@ovp-proto/types/utils/paths";
import { VIDEOS_PACKAGE_NAME } from "@ovp-proto/types/videos";

import { CommentController } from "~src/comments/controllers/comment.controller";
import { CommentRepository } from "~src/comments/repositories/comment.repository";
import { CommentService } from "~src/comments/services/comment.service";
import { GrpcConfig } from "~src/config/providers/grpc.config";

@Global()
@Module({
	imports: [
		GrpcClientsModuleConfigBuilderFactory.create(GrpcConfig)
			.addClient(VIDEOS_PACKAGE_NAME, "grpcVideoServiceUrl", ProtoPaths.Videos)
			.addClient(CHANNELS_PACKAGE_NAME, "grpcChannelServiceUrl", ProtoPaths.Channels)
			.build(),
	],
	controllers: [CommentController],
	providers: [CommentRepository, CommentService, KafkaProducerService],
	exports: [CommentService],
})
export class CommentsModule {}
