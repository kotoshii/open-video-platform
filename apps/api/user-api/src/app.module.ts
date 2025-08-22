import { Module } from "@nestjs/common";
import { KyselyModuleConfigBuilder } from "@ovp-lib/api/database/kysely-module-config-builder";
import { KyselyModuleConfigBuilder } from "@ovp-lib/api/config/builders/kysely-module-config-builder";

import { ConfigModule } from "~src/config/config.module";
import { DatabaseConfig } from "~src/config/providers/database.config";
import { UsersModule } from "~src/users/users.module";

@Module({
	imports: [
		ConfigModule,
		new KyselyModuleConfigBuilder().setDatabaseConfigClass(DatabaseConfig).addDefaults().build(),
		UsersModule,
	],
})
export class AppModule {}
