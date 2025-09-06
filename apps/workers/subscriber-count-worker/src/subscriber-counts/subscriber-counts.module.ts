import { Module } from "@nestjs/common";
import { KafkaConsumerService } from "@ovp-lib/api/kafka/services/kafka-consumer.service";
import { KafkaDeduplicationService } from "@ovp-lib/api/kafka/services/kafka-deduplication.service";

import { ChannelsModule } from "~src/channels/channels.module";
import { SubscriberCountKafkaController } from "~src/subscriber-counts/controllers/subscriber-count-kafka.controller";
import { SubscriberCountService } from "~src/subscriber-counts/services/subscriber-count.service";

@Module({
	imports: [ChannelsModule],
	providers: [KafkaDeduplicationService, KafkaConsumerService, SubscriberCountService],
	controllers: [SubscriberCountKafkaController],
})
export class SubscriberCountsModule {}
