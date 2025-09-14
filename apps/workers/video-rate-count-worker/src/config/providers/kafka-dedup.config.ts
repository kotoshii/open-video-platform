import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommonKafkaDedupConfig } from "@ovp-lib/api/config/providers/common-kafka-dedup.config";

@Injectable()
export class KafkaDedupConfig extends CommonKafkaDedupConfig {
	// biome-ignore lint/complexity/noUselessConstructor: needed for cross-package inheritance
	constructor(config: ConfigService) {
		super(config);
	}
}
