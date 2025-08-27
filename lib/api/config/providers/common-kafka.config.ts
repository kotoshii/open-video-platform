import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ICommonKafkaConfig } from "~config/interfaces/common-kafka-config.interface";

@Injectable()
export class CommonKafkaConfig implements ICommonKafkaConfig {
	constructor(protected config: ConfigService) {}

	get kafkaBrokers() {
		return this.config.get<string>("KAFKA_BROKERS", "").split(",");
	}

	get kafkaClientId() {
		return this.config.get<string>("KAFKA_CLIENT_ID", "");
	}

	get kafkaGroupId() {
		return this.config.get<string>("KAFKA_GROUP_ID", "");
	}
}
