import { Controller, OnModuleInit } from "@nestjs/common";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";

import { CommentService } from "~src/comments/services/comment.service";

@Controller()
export class CommentKafkaController implements OnModuleInit {
	constructor(
		private readonly commentService: CommentService,
		private readonly kafkaConsumerService: KafkaConsumerService,
	) {}

	async onModuleInit() {
		await this.handleChannelEvents();
	}

	async handleChannelEvents() {
		await this.kafkaConsumerService.subscribe(KafkaTopic.ChannelEvents, async (payload) => {
			await this.commentService.handleChannelEvents(payload);
		});
	}
}
