import { Module } from "@nestjs/common";
import { KyselyModuleConfigBuilder } from "@ovp-lib/api/database/kysely-module-config-builder";

import { ChannelsModule } from "~src/channels/channels.module";
import { ConfigModule } from "~src/config/config.module";
import { DatabaseConfig } from "~src/config/providers/database.config";

@Module({
	imports: [
		ConfigModule,
		new KyselyModuleConfigBuilder().setDatabaseConfigClass(DatabaseConfig).addDefaults().build(),
		ChannelsModule,
	],
})
export class AppModule {}
