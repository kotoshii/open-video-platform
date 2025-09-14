import { Module } from "@nestjs/common";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";
import { KafkaDeduplicationService } from "@ovp-lib/api/kafka/services/kafka-deduplication.service";

import { VideoRateCountKafkaController } from "~src/video-rate-counts/controllers/video-rate-count-kafka.controller";
import { VideoRateCountService } from "~src/video-rate-counts/services/video-rate-count.service";
import { VideosModule } from "~src/videos/videos.module";

@Module({
	imports: [VideosModule],
	providers: [KafkaDeduplicationService, KafkaConsumerService, VideoRateCountService],
	controllers: [VideoRateCountKafkaController],
})
export class VideoRateCountsModule {}
