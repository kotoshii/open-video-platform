import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ViewsDedupConfig {
	constructor(protected config: ConfigService) {}

	get viewsDedupRedisUrl() {
		return this.config.get<string>("VIEWS_DEDUP_REDIS_URL", "");
	}

	// default: 1 hour (in seconds)
	get viewsDedupTtl() {
		return parseInt(this.config.get<string>("VIEWS_DEDUP_TTL", "3600"), 10);
	}
}
