import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { NodeEnv } from "~src/config/types/node-env";

@Injectable()
export class AppConfig {
	constructor(private config: ConfigService) {}

	get nodeEnv(): NodeEnv {
		return this.config.get<NodeEnv>("NODE_ENV", "local");
	}

	get port() {
		return parseInt(this.config.get<string>("PORT", "3001"), 10);
	}

	get corsDomains() {
		const domains = this.config.get<string>("CORS_DOMAINS", "*").split(",");
		return domains.includes("*") ? "*" : domains;
	}
}
