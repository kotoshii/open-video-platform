import { Module } from "@nestjs/common";
import { KyselyModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/kysely-module-config-builder";

import { ChannelsModule } from "~src/channels/channels.module";
import { ConfigModule } from "~src/config/config.module";
import { DatabaseConfig } from "~src/config/providers/database.config";
import { SubscriberCountsModule } from "~src/subscriber-counts/subscriber-counts.module";

@Module({
	imports: [
		ConfigModule,
		KyselyModuleConfigBuilderFactory.create(DatabaseConfig, "postgres").addDefaults().build(),
		ChannelsModule,
		SubscriberCountsModule,
	],
})
export class AppModule {}
