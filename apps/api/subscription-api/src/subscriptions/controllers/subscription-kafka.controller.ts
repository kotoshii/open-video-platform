import { Controller, OnModuleInit } from "@nestjs/common";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";

import { SubscriptionService } from "~src/subscriptions/services/subscription.service";

@Controller()
export class SubscriptionKafkaController implements OnModuleInit {
	constructor(
		private readonly subscriptionService: SubscriptionService,
		private readonly kafkaConsumerService: KafkaConsumerService,
	) {}

	async onModuleInit() {
		await this.handleChannelEvents();
	}

	async handleChannelEvents() {
		await this.kafkaConsumerService.subscribe(KafkaTopic.ChannelEvents, async (payload) => {
			await this.subscriptionService.handleChannelEvents(payload);
		});
	}
}
