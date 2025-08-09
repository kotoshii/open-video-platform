import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

import { AppConfig } from "~src/config/providers/app.config";

@Global()
@Module({
	imports: [NestConfigModule.forRoot()],
	providers: [AppConfig],
	exports: [AppConfig],
})
export class ConfigModule {}
