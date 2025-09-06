import { Controller, OnModuleInit } from "@nestjs/common";
import { KafkaTopic } from "@ovp-lib/api/kafka/constants/topic-names";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";

import { SubscriberCountService } from "~src/subscriber-counts/services/subscriber-count.service";

@Controller()
export class SubscriberCountKafkaController implements OnModuleInit {
	constructor(
		private readonly kafkaConsumerService: KafkaConsumerService,
		private readonly subscriberCountService: SubscriberCountService,
	) {}

	async onModuleInit() {
		await this.handleSubscriptionEvents();
	}

	async handleSubscriptionEvents() {
		await this.kafkaConsumerService.subscribeBatch(
			KafkaTopic.SubscriptionEvents,
			async (payload) => {
				await this.subscriberCountService.handleSubscriptionEvents(payload);
			},
			{
				autoCommit: false,
				eachBatchAutoResolve: false,
				partitionsConsumedConcurrently: 1,
			},
		);
	}
}
