import { ClassConstructor } from "class-transformer";
import { CamelCasePlugin, DeduplicateJoinsPlugin, KyselyPlugin, PostgresDialect } from "kysely";
import { KyselyModule } from "nestjs-kysely";
import { Pool } from "pg";

import { ICommonDatabaseConfig } from "~config/interfaces/common-database-config.interface";

type DialectName = "postgres";

export class KyselyModuleConfigBuilder {
	private DatabaseConfigClass: ClassConstructor<ICommonDatabaseConfig> | null = null;
	private dialect: DialectName | null = null;
	private readonly plugins: KyselyPlugin[] = [];

	setDatabaseConfigClass(DatabaseConfigClass: ClassConstructor<ICommonDatabaseConfig>) {
		this.DatabaseConfigClass = DatabaseConfigClass;
		return this;
	}

	setDialect(name: DialectName) {
		this.dialect = name;
		return this;
	}

	addDeduplicateJoinsPlugin() {
		this.plugins.push(new DeduplicateJoinsPlugin());
		return this;
	}

	addCamelCasePlugin() {
		this.plugins.push(new CamelCasePlugin());
		return this;
	}

	/**
	 * Sets `"postgres"` dialect, adds `DeduplicateJoinsPlugin` and `CamelCasePlugin`.
	 * */
	addDefaults() {
		this.setDialect("postgres");
		this.addDeduplicateJoinsPlugin();
		this.addCamelCasePlugin();

		return this;
	}

	build() {
		if (!this.DatabaseConfigClass) {
			throw new Error(
				"Failed to build Kysely module config: DatabaseConfigClass was not provided. Make sure you didn't forget to set it via `setDatabaseConfigClass()` method",
			);
		}

		if (!this.dialect) {
			throw new Error(
				"Failed to build Kysely module config: dialect was not provided. Make sure you didn't forget to set it via `setDialect()` method",
			);
		}

		return KyselyModule.forRootAsync({
			useFactory: (databaseConfig: ICommonDatabaseConfig) => ({
				dialect: this.createDialectConfig(this.dialect as DialectName, databaseConfig),
				plugins: this.plugins,
			}),
			inject: [this.DatabaseConfigClass],
		});
	}

	private createDialectConfig(name: DialectName, databaseConfig: ICommonDatabaseConfig) {
		switch (name) {
			case "postgres": {
				return new PostgresDialect({
					pool: new Pool({ connectionString: databaseConfig.databaseUrl }),
				});
			}
		}
	}
}
