import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

import { AppConfig } from "~src/config/providers/app.config";
import { DatabaseConfig } from "~src/config/providers/database.config";
import { GrpcConfig } from "~src/config/providers/grpc.config";

@Global()
@Module({
	imports: [NestConfigModule.forRoot()],
	providers: [AppConfig, DatabaseConfig, GrpcConfig],
	exports: [AppConfig, DatabaseConfig, GrpcConfig],
})
export class ConfigModule {}
