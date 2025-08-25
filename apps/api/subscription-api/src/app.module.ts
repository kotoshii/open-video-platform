import { Module } from "@nestjs/common";
import { JwtModuleConfigBuilder } from "@ovp-lib/api/config/builders/jwt-module-config-builder";
import { KyselyModuleConfigBuilder } from "@ovp-lib/api/config/builders/kysely-module-config-builder";

import { ConfigModule } from "~src/config/config.module";
import { DatabaseConfig } from "~src/config/providers/database.config";

@Module({
	imports: [
		ConfigModule,
		new KyselyModuleConfigBuilder().setDatabaseConfigClass(DatabaseConfig).addDefaults().build(),
		new JwtModuleConfigBuilder().build(),
	],
})
export class AppModule {}
