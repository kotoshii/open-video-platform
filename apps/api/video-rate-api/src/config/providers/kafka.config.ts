import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommonKafkaConfig } from "@ovp-lib/api/config/providers/common-kafka.config";

@Injectable()
export class KafkaConfig extends CommonKafkaConfig {
	// biome-ignore lint/complexity/noUselessConstructor: needed for cross-package inheritance
	constructor(config: ConfigService) {
		super(config);
	}

	override get kafkaClientId() {
		return this.config.get<string>("KAFKA_CLIENT_ID", "video-rate-api");
	}
}
