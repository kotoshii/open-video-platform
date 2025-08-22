import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { JWT_CONFIG_INJECTION_TOKEN } from "@ovp-lib/api/config/constants/injection-tokens";

import { AppConfig } from "~src/config/providers/app.config";
import { AuthSessionConfig } from "~src/config/providers/auth-session.config";
import { DatabaseConfig } from "~src/config/providers/database.config";
import { GrpcConfig } from "~src/config/providers/grpc.config";
import { JwtConfig } from "~src/config/providers/jwt.config";

@Global()
@Module({
	imports: [NestConfigModule.forRoot()],
	providers: [
		AppConfig,
		DatabaseConfig,
		GrpcConfig,
		{ provide: JWT_CONFIG_INJECTION_TOKEN, useClass: JwtConfig },
		AuthSessionConfig,
	],
	exports: [AppConfig, DatabaseConfig, GrpcConfig, JWT_CONFIG_INJECTION_TOKEN, AuthSessionConfig],
})
export class ConfigModule {}
