import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import {
	CORS_CONFIG_INJECTION_TOKEN,
	JWT_CONFIG_INJECTION_TOKEN,
} from "@ovp-lib/api/config/constants/injection-tokens";

import { AppConfig } from "~src/config/providers/app.config";
import { CorsConfig } from "~src/config/providers/cors.config";
import { DatabaseConfig } from "~src/config/providers/database.config";
import { GrpcConfig } from "~src/config/providers/grpc.config";
import { JwtConfig } from "~src/config/providers/jwt.config";

@Global()
@Module({
	imports: [NestConfigModule.forRoot()],
	providers: [
		AppConfig,
		{ provide: CORS_CONFIG_INJECTION_TOKEN, useClass: CorsConfig },
		DatabaseConfig,
		GrpcConfig,
		{ provide: JWT_CONFIG_INJECTION_TOKEN, useClass: JwtConfig },
	],
	exports: [AppConfig, CORS_CONFIG_INJECTION_TOKEN, DatabaseConfig, GrpcConfig, JWT_CONFIG_INJECTION_TOKEN],
})
export class ConfigModule {}
