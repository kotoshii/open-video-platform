import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommonDatabaseConfig } from "@ovp-lib/api/config/providers/common-database.config";

@Injectable()
export class DatabaseConfig extends CommonDatabaseConfig {
	// biome-ignore lint/complexity/noUselessConstructor: needed for cross-package inheritance
	constructor(config: ConfigService) {
		super(config);
	}
}
