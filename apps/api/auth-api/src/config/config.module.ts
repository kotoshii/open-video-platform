import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

import { AppConfig } from "~src/config/providers/app.config";
import { AuthSessionConfig } from "~src/config/providers/auth-session.config";
import { DatabaseConfig } from "~src/config/providers/database.config";
import { GrpcConfig } from "~src/config/providers/grpc.config";
import { JwtConfig } from "~src/config/providers/jwt.config";

@Global()
@Module({
	imports: [NestConfigModule.forRoot()],
	providers: [AppConfig, DatabaseConfig, GrpcConfig, JwtConfig, AuthSessionConfig],
	exports: [AppConfig, DatabaseConfig, GrpcConfig, JwtConfig, AuthSessionConfig],
})
export class ConfigModule {}
