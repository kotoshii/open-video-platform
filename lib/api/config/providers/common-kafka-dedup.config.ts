import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ICommonKafkaDedupConfig } from "~config/interfaces/common-kafka-dedup-config.interface";

@Injectable()
export class CommonKafkaDedupConfig implements ICommonKafkaDedupConfig {
	constructor(protected config: ConfigService) {}

	get kafkaDedupRedisUrl() {
		return this.config.get<string>("KAFKA_DEDUP_REDIS_URL", "");
	}

	// default: 1 hour (in seconds)
	get kafkaDedupTtl() {
		return parseInt(this.config.get<string>("KAFKA_DEDUP_TTL", "3600"), 10);
	}
}
