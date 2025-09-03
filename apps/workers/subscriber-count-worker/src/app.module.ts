import { Module } from "@nestjs/common";
import { KyselyModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/kysely-module-config-builder";

// import { ChannelsModule } from "~src/channels/channels.module";
import { ConfigModule } from "~src/config/config.module";
import { DatabaseConfig } from "~src/config/providers/database.config";

@Module({
	imports: [
		ConfigModule,
		KyselyModuleConfigBuilderFactory.create(DatabaseConfig, "postgres").addDefaults().build(),
		// ChannelsModule,
	],
})
export class AppModule {}
