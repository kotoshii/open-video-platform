import { Module } from "@nestjs/common";
import { JwtModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/jwt-module-config-builder";
import { KyselyModuleConfigBuilderFactory } from "@ovp-lib/api/config/builders/kysely-module-config-builder";

import { AuthModule } from "~src/auth/auth.module";
import { AuthSessionsModule } from "~src/auth-sessions/auth-sessions.module";
import { ConfigModule } from "~src/config/config.module";
import { DatabaseConfig } from "~src/config/providers/database.config";
import { PasswordsModule } from "~src/passwords/passwords.module";
import { TokensModule } from "~src/tokens/tokens.module";

@Module({
	imports: [
		ConfigModule,
		KyselyModuleConfigBuilderFactory.create(DatabaseConfig, "postgres").addDefaults().build(),
		JwtModuleConfigBuilderFactory.create().build(),
		AuthModule,
		AuthSessionsModule,
		PasswordsModule,
		TokensModule,
	],
})
export class AppModule {}
