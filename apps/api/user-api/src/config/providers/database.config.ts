import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseConfig {
	constructor(private config: ConfigService) {}

	get databaseUrl() {
		return this.config.get<string>("DATABASE_URL", "");
	}
}
