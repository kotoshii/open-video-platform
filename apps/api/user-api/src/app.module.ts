import { Module } from "@nestjs/common";
import { CamelCasePlugin, DeduplicateJoinsPlugin, PostgresDialect } from "kysely";
import { KyselyModule } from "nestjs-kysely";
import { Pool } from "pg";

import { ConfigModule } from "~src/config/config.module";
import { DatabaseConfig } from "~src/config/providers/database.config";
import { UsersModule } from "~src/users/users.module";

@Module({
	imports: [
		ConfigModule,
		KyselyModule.forRootAsync({
			useFactory: (databaseConfig: DatabaseConfig) => ({
				dialect: new PostgresDialect({
					pool: new Pool({ connectionString: databaseConfig.databaseUrl }),
				}),
				plugins: [new DeduplicateJoinsPlugin(), new CamelCasePlugin()],
			}),
			inject: [DatabaseConfig],
		}),
		UsersModule,
	],
})
export class AppModule {}
