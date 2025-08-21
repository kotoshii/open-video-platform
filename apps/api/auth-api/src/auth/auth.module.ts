import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
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
		ClientsModule.registerAsync([
			{
				name: USERS_PACKAGE_NAME,
				useFactory: (grpcConfig: GrpcConfig) => ({
					transport: Transport.GRPC,
					options: {
						package: USERS_PACKAGE_NAME,
						url: grpcConfig.grpcUserServiceUrl,
						protoPath: ProtoPaths.Users,
					},
				}),
				inject: [GrpcConfig],
			},
			{
				name: CHANNELS_PACKAGE_NAME,
				useFactory: (grpcConfig: GrpcConfig) => ({
					transport: Transport.GRPC,
					options: {
						package: CHANNELS_PACKAGE_NAME,
						url: grpcConfig.grpcChannelServiceUrl,
						protoPath: ProtoPaths.Channels,
					},
				}),
				inject: [GrpcConfig],
			},
		]),
		PasswordsModule,
		AuthSessionsModule,
		TokensModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
