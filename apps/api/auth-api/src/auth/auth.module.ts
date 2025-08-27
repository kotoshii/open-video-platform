import { Module } from "@nestjs/common";
import { GrpcClientsModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/grpc-clients-module-config-builder";
import { CHANNELS_PACKAGE_NAME } from "@ovp-proto/types/channels";
import { USERS_PACKAGE_NAME } from "@ovp-proto/types/users";
import { ProtoPaths } from "@ovp-proto/types/utils/paths";

import { AuthController } from "~src/auth/controllers/auth.controller";
import { AuthService } from "~src/auth/services/auth.service";
import { AuthSessionsModule } from "~src/auth-sessions/auth-sessions.module";
import { GrpcConfig } from "~src/config/providers/grpc.config";
import { PasswordsModule } from "~src/passwords/passwords.module";
import { TokensModule } from "~src/tokens/tokens.module";

@Module({
	imports: [
		GrpcClientsModuleConfigBuilderFactory.create(GrpcConfig)
			.addClient(USERS_PACKAGE_NAME, "grpcUserServiceUrl", ProtoPaths.Users)
			.addClient(CHANNELS_PACKAGE_NAME, "grpcChannelServiceUrl", ProtoPaths.Channels)
			.build(),
		PasswordsModule,
		AuthSessionsModule,
		TokensModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
