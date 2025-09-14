import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { Kafka, Producer } from "kafkajs";

import { KAFKA_CONFIG_INJECTION_TOKEN } from "~config/constants/injection-tokens";
import { ICommonKafkaConfig } from "~config/interfaces/common-kafka-config.interface";
import { BaseKafkaEventPayloadDto } from "~kafka/dto/base-kafka-event-payload.dto";

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnApplicationShutdown {
	private readonly kafka: Kafka;
	private readonly producer: Producer;

	constructor(@Inject(KAFKA_CONFIG_INJECTION_TOKEN) private readonly kafkaConfig: ICommonKafkaConfig) {
		this.kafka = new Kafka({
			clientId: this.kafkaConfig.kafkaClientId,
			brokers: this.kafkaConfig.kafkaBrokers,
		});
		this.producer = this.kafka.producer();
	}

	async onModuleInit() {
		await this.producer.connect();
	}

	async onApplicationShutdown() {
		await this.producer.disconnect();
	}

	async emit(topic: string, value: BaseKafkaEventPayloadDto, key?: string) {
		const plain = instanceToPlain(value, { exposeDefaultValues: true });
		await this.producer.send({
			topic,
			messages: [{ key, value: JSON.stringify(plain) }],
		});
	}
}
