import { Module } from "@nestjs/common";
import { KyselyModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/kysely-module-config-builder";

import { ConfigModule } from "~src/config/config.module";
import { DatabaseConfig } from "~src/config/providers/database.config";
import { VideoCommentCountsModule } from "~src/video-comment-counts/video-comment-counts.module";
import { VideosModule } from "~src/videos/videos.module";

@Module({
	imports: [
		ConfigModule,
		KyselyModuleConfigBuilderFactory.create(DatabaseConfig, "postgres").addDefaults().build(),
		VideosModule,
		VideoCommentCountsModule,
	],
})
export class AppModule {}
