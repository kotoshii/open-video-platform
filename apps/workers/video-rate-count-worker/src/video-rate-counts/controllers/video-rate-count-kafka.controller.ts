import { Controller, OnModuleInit } from "@nestjs/common";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";

import { VideoRateCountService } from "~src/video-rate-counts/services/video-rate-count.service";

@Controller()
export class VideoRateCountKafkaController implements OnModuleInit {
	constructor(
		private readonly kafkaConsumerService: KafkaConsumerService,
		private readonly videoRateCountService: VideoRateCountService,
	) {}

	async onModuleInit() {
		await this.handleVideoRateEvents();
	}

	async handleVideoRateEvents() {
		await this.kafkaConsumerService.subscribeBatch(
			KafkaTopic.VideoRateEvents,
			async (payload) => {
				await this.videoRateCountService.handleEvents(payload);
			},
			{
				autoCommit: false,
				eachBatchAutoResolve: false,
				partitionsConsumedConcurrently: 1,
			},
		);
	}
}
