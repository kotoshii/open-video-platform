import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ICommonCorsConfig } from "~config/interfaces/common-cors-config.interface";

@Injectable()
export class CommonCorsConfig implements ICommonCorsConfig {
	constructor(protected config: ConfigService) {}

	get corsDomains() {
		const domains = this.config.get<string>("CORS_DOMAINS", "*").split(",");
		return domains.includes("*") ? "*" : domains;
	}
}
