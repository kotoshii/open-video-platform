import { Type } from "@nestjs/common";
import { CamelCasePlugin, DeduplicateJoinsPlugin, KyselyPlugin, PostgresDialect } from "kysely";
import { KyselyModule } from "nestjs-kysely";
import { Pool } from "pg";

import { ICommonDatabaseConfig } from "~config/interfaces/common-database-config.interface";

type DialectName = "postgres";

export class KyselyModuleConfigBuilderFactory {
	static create(DatabaseConfigClass: Type<ICommonDatabaseConfig>, dialect: DialectName) {
		return new KyselyModuleConfigBuilder(DatabaseConfigClass, dialect);
	}
}

class KyselyModuleConfigBuilder {
	private readonly plugins: KyselyPlugin[] = [];

	constructor(
		private readonly DatabaseConfigClass: Type<ICommonDatabaseConfig>,
		private readonly dialect: DialectName,
	) {}

	addDeduplicateJoinsPlugin() {
		this.plugins.push(new DeduplicateJoinsPlugin());
		return this;
	}

	addCamelCasePlugin() {
		this.plugins.push(new CamelCasePlugin());
		return this;
	}

	/**
	 * Adds `DeduplicateJoinsPlugin` and `CamelCasePlugin`.
	 * */
	addDefaults() {
		this.addDeduplicateJoinsPlugin();
		this.addCamelCasePlugin();

		return this;
	}

	build() {
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
