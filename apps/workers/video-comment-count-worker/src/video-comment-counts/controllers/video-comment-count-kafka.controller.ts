import { Controller, OnModuleInit } from "@nestjs/common";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";

import { VideoCommentCountService } from "~src/video-comment-counts/services/video-comment-count.service";

@Controller()
export class VideoCommentCountKafkaController implements OnModuleInit {
	constructor(
		private readonly kafkaConsumerService: KafkaConsumerService,
		private readonly videoCommentCountService: VideoCommentCountService,
	) {}

	async onModuleInit() {
		await this.handleCommentEvents();
	}

	async handleCommentEvents() {
		await this.kafkaConsumerService.subscribeBatch(
			KafkaTopic.CommentEvents,
			async (payload) => {
				await this.videoCommentCountService.handleEvents(payload);
			},
			{
				autoCommit: false,
				eachBatchAutoResolve: false,
				partitionsConsumedConcurrently: 1,
			},
		);
	}
}
