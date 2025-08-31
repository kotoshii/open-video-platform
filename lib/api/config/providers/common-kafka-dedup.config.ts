import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import ms, { StringValue } from "ms";

import { ICommonKafkaDedupConfig } from "~config/interfaces/common-kafka-dedup-config.interface";

@Injectable()
export class CommonKafkaDedupConfig implements ICommonKafkaDedupConfig {
	constructor(protected config: ConfigService) {}

	get kafkaDedupRedisUrl() {
		return this.config.get<string>("KAFKA_DEDUP_REDIS_URL", "");
	}

	get kafkaDedupTtl() {
		return ms(this.config.get<string>("KAFKA_DEDUP_TTL", "7d") as StringValue);
	}
}
