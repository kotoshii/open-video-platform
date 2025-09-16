import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import {
	KAFKA_CONFIG_INJECTION_TOKEN,
	KAFKA_DEDUP_CONFIG_INJECTION_TOKEN,
} from "@ovp-lib/api/config/constants/injection-tokens";

import { AppConfig } from "~src/config/providers/app.config";
import { DatabaseConfig } from "~src/config/providers/database.config";
import { KafkaConfig } from "~src/config/providers/kafka.config";
import { KafkaDedupConfig } from "~src/config/providers/kafka-dedup.config";

@Global()
@Module({
	imports: [NestConfigModule.forRoot()],
	providers: [
		AppConfig,
		DatabaseConfig,
		{ provide: KAFKA_CONFIG_INJECTION_TOKEN, useClass: KafkaConfig },
		{ provide: KAFKA_DEDUP_CONFIG_INJECTION_TOKEN, useClass: KafkaDedupConfig },
	],
	exports: [AppConfig, DatabaseConfig, KAFKA_CONFIG_INJECTION_TOKEN, KAFKA_DEDUP_CONFIG_INJECTION_TOKEN],
})
export class ConfigModule {}
