import { Module } from "@nestjs/common";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";
import { KafkaDeduplicationService } from "@ovp-lib/api/kafka/services/kafka-deduplication.service";

import { CommentRateCountKafkaController } from "~src/comment-rate-counts/controllers/comment-rate-count-kafka.controller";
import { CommentRateCountService } from "~src/comment-rate-counts/services/comment-rate-count.service";
import { CommentsModule } from "~src/comments/comments.module";

@Module({
	imports: [CommentsModule],
	providers: [KafkaDeduplicationService, KafkaConsumerService, CommentRateCountService],
	controllers: [CommentRateCountKafkaController],
})
export class CommentRateCountsModule {}
