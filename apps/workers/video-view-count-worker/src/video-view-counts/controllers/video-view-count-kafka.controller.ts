import { Controller, OnModuleInit } from "@nestjs/common";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";

import { VideoViewCountService } from "~src/video-view-counts/services/video-view-count.service";

@Controller()
export class VideoViewCountKafkaController implements OnModuleInit {
	constructor(
		private readonly kafkaConsumerService: KafkaConsumerService,
		private readonly videoViewCountService: VideoViewCountService,
	) {}

	async onModuleInit() {
		await this.handleVideoEvents();
	}

	async handleVideoEvents() {
		await this.kafkaConsumerService.subscribeBatch(
			KafkaTopic.VideoEvents,
			async (payload) => {
				await this.videoViewCountService.handleEvents(payload);
			},
			{
				autoCommit: false,
				eachBatchAutoResolve: false,
				partitionsConsumedConcurrently: 1,
			},
		);
	}
}
