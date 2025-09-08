import { Controller, OnModuleInit } from "@nestjs/common";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";

import { VideoService } from "~src/videos/services/video.service";

@Controller()
export class VideoKafkaController implements OnModuleInit {
	constructor(
		private readonly videoService: VideoService,
		private readonly kafkaConsumerService: KafkaConsumerService,
	) {}

	async onModuleInit() {
		await this.handleChannelEvents();
	}

	async handleChannelEvents() {
		await this.kafkaConsumerService.subscribe(KafkaTopic.ChannelEvents, async (payload) => {
			await this.videoService.handleChannelEvents(payload);
		});
	}
}
