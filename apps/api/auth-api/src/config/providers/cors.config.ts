import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommonCorsConfig } from "@ovp-lib/api/config/providers/common-cors.config";

@Injectable()
export class CorsConfig extends CommonCorsConfig {
	// biome-ignore lint/complexity/noUselessConstructor: needed for cross-package inheritance
	constructor(config: ConfigService) {
		super(config);
	}
}
