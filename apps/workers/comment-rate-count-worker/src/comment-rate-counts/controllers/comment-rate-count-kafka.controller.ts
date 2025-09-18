import { Controller, OnModuleInit } from "@nestjs/common";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";

import { CommentRateCountService } from "~src/comment-rate-counts/services/comment-rate-count.service";

@Controller()
export class CommentRateCountKafkaController implements OnModuleInit {
	constructor(
		private readonly kafkaConsumerService: KafkaConsumerService,
		private readonly commentRateCountService: CommentRateCountService,
	) {}

	async onModuleInit() {
		await this.handleCommentRateEvents();
	}

	async handleCommentRateEvents() {
		await this.kafkaConsumerService.subscribeBatch(
			KafkaTopic.CommentRateEvents,
			async (payload) => {
				await this.commentRateCountService.handleEvents(payload);
			},
			{
				autoCommit: false,
				eachBatchAutoResolve: false,
				partitionsConsumedConcurrently: 1,
			},
		);
	}
}
