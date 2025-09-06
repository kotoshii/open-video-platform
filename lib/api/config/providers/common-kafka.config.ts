import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ICommonKafkaConfig } from "~config/interfaces/common-kafka-config.interface";

@Injectable()
export class CommonKafkaConfig implements ICommonKafkaConfig {
	constructor(protected config: ConfigService) {}

	get kafkaBrokers() {
		return this.config.get<string>("KAFKA_BROKERS", "").split(",");
	}

	// default: 30 seconds
	get kafkaSessionTimeout() {
		return parseInt(this.config.get("KAFKA_SESSION_TIMEOUT", "30000"), 10);
	}

	// default: 3 seconds
	get kafkaHeartbeatInterval() {
		return parseInt(this.config.get("KAFKA_HEARTBEAT_INTERVAL", "3000"), 10);
	}

	get kafkaClientId() {
		return this.config.get<string>("KAFKA_CLIENT_ID", "");
	}

	get kafkaGroupId() {
		return this.config.get<string>("KAFKA_GROUP_ID", "");
	}

	// default: 5 MB (5242880 bytes)
	get kafkaMinBytes() {
		return parseInt(this.config.get("KAFKA_MIN_BYTES", "5242880"), 10);
	}

	// default: 10 MB (10485760 bytes)
	get kafkaMaxBytes() {
		return parseInt(this.config.get("KAFKA_MAX_BYTES", "10485760"), 10);
	}

	// default: 10 seconds
	get kafkaMaxWaitTimeInMs() {
		return parseInt(this.config.get("KAFKA_MAX_WAIT_TIME_IN_MS", "10000"), 10);
	}
}
