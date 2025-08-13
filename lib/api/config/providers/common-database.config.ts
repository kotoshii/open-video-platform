import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ICommonDatabaseConfig } from "~config/interfaces/common-database-config.interface";

@Injectable()
export class CommonDatabaseConfig implements ICommonDatabaseConfig {
	constructor(private config: ConfigService) {}

	get databaseUrl() {
		return this.config.get<string>("DATABASE_URL", "");
	}
}
