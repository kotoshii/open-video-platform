import { Module } from "@nestjs/common";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";
import { KafkaDeduplicationService } from "@ovp-lib/api/kafka/services/kafka-deduplication.service";

import { VideoCommentCountKafkaController } from "~src/video-comment-counts/controllers/video-comment-count-kafka.controller";
import { VideoCommentCountService } from "~src/video-comment-counts/services/video-comment-count.service";
import { VideosModule } from "~src/videos/videos.module";

@Module({
	imports: [VideosModule],
	providers: [KafkaDeduplicationService, KafkaConsumerService, VideoCommentCountService],
	controllers: [VideoCommentCountKafkaController],
})
export class VideoCommentCountsModule {}
