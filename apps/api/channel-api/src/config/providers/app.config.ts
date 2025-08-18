import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommonAppConfig } from "@ovp-lib/api/config/providers/common-app.config";

@Injectable()
export class AppConfig extends CommonAppConfig {
	// biome-ignore lint/complexity/noUselessConstructor: needed for cross-package inheritance
	constructor(config: ConfigService) {
		super(config);
	}

	override get port() {
		return parseInt(this.config.get<string>("PORT", "3002"), 10);
	}
}
