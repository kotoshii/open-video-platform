import { Module } from "@nestjs/common";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";
import { KafkaDeduplicationService } from "@ovp-lib/api/kafka/services/kafka-deduplication.service";

import { VideoViewCountKafkaController } from "~src/video-view-counts/controllers/video-view-count-kafka.controller";
import { VideoViewCountService } from "~src/video-view-counts/services/video-view-count.service";
import { ViewsDeduplicationService } from "~src/video-view-counts/services/views-deduplication.service";
import { VideosModule } from "~src/videos/videos.module";

@Module({
	imports: [VideosModule],
	providers: [KafkaDeduplicationService, KafkaConsumerService, ViewsDeduplicationService, VideoViewCountService],
	controllers: [VideoViewCountKafkaController],
})
export class VideoViewCountsModule {}
