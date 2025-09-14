import { Module } from "@nestjs/common";
import { JwtModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/jwt-module-config-builder";
import { KyselyModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/kysely-module-config-builder";

import { ConfigModule } from "~src/config/config.module";
import { DatabaseConfig } from "~src/config/providers/database.config";
import { VideoRatesModule } from "~src/video-rates/video-rates.module";

@Module({
	imports: [
		ConfigModule,
		KyselyModuleConfigBuilderFactory.create(DatabaseConfig, "postgres").addDefaults().build(),
		JwtModuleConfigBuilderFactory.create().build(),
		VideoRatesModule,
	],
})
export class AppModule {}
