import { Inject, Injectable, OnApplicationShutdown } from "@nestjs/common";
import { ConsumerRunConfig, EachBatchHandler } from "@nestjs/microservices/external/kafka.interface";
import { MaybeArray } from "@ovp-lib/common/types/maybe-array";
import { toArray } from "@ovp-lib/common/utils/arrays";
import { Consumer, Kafka } from "kafkajs";

import { KAFKA_CONFIG_INJECTION_TOKEN } from "~config/constants/injection-tokens";
import { ICommonKafkaConfig } from "~config/interfaces/common-kafka-config.interface";

type SubscribeConfig = Omit<ConsumerRunConfig, "eachBatch" | "eachMessage">;

@Injectable()
export class KafkaConsumerService implements OnApplicationShutdown {
	private readonly kafka: Kafka;
	private readonly consumers: Consumer[] = [];

	constructor(@Inject(KAFKA_CONFIG_INJECTION_TOKEN) private readonly kafkaConfig: ICommonKafkaConfig) {
		this.kafka = new Kafka({
			clientId: this.kafkaConfig.kafkaClientId,
			brokers: this.kafkaConfig.kafkaBrokers,
		});
	}

	async onApplicationShutdown() {
		for (const consumer of this.consumers) {
			await consumer.disconnect();
		}
	}

	async subscribeBatch(topics: MaybeArray<string>, handler: EachBatchHandler, config?: SubscribeConfig) {
		const consumer = this.createConsumer();

		await consumer.connect();
		await consumer.subscribe({ topics: toArray(topics), fromBeginning: false });
		await consumer.run({ ...config, eachBatch: handler });

		this.consumers.push(consumer);
	}

	private createConsumer() {
		if (!this.kafkaConfig.kafkaGroupId) {
			throw new Error(
				"Failed to build Kafka client config (consumer): group ID property is missing in the provided configuration",
			);
		}

		return this.kafka.consumer({
			groupId: this.kafkaConfig.kafkaGroupId,
			minBytes: this.kafkaConfig.kafkaMinBytes,
			maxBytes: this.kafkaConfig.kafkaMaxBytes,
			maxWaitTimeInMs: this.kafkaConfig.kafkaMaxWaitTimeInMs,
			sessionTimeout: this.kafkaConfig.kafkaSessionTimeout,
			heartbeatInterval: this.kafkaConfig.kafkaHeartbeatInterval,
		});
	}
}
