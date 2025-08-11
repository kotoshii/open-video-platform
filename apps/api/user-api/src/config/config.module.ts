import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

import { AppConfig } from "~src/config/providers/app.config";
import { DatabaseConfig } from "~src/config/providers/database.config";

@Global()
@Module({
	imports: [NestConfigModule.forRoot()],
	providers: [AppConfig, DatabaseConfig],
	exports: [AppConfig, DatabaseConfig],
})
export class ConfigModule {}
