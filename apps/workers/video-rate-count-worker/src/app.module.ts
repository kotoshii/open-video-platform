import { Module } from "@nestjs/common";
import { KyselyModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/kysely-module-config-builder";

import { ConfigModule } from "~src/config/config.module";
import { DatabaseConfig } from "~src/config/providers/database.config";
import { VideoRateCountsModule } from "~src/video-rate-counts/video-rate-counts.module";
import { VideosModule } from "~src/videos/videos.module";

@Module({
	imports: [
		ConfigModule,
		KyselyModuleConfigBuilderFactory.create(DatabaseConfig, "postgres").addDefaults().build(),
		VideosModule,
		VideoRateCountsModule,
	],
})
export class AppModule {}
