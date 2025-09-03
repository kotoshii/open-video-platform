import { Logger } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";
import { NestMicroserviceAppConfigBuilderFactory } from "@ovp-lib/api/config/builders/nest-microservice-app-config-builder";

import { AppModule } from "~src/app.module";
import { KafkaConfig } from "~src/config/providers/kafka.config";

const logger = new Logger("bootstrap");

async function bootstrap() {
	const configBuilder = await NestMicroserviceAppConfigBuilderFactory.create(AppModule);
	const kafkaConfig = configBuilder.getProvider(KafkaConfig);

	const app = await configBuilder
		.createMicroservice({
			transport: Transport.KAFKA,
			options: {
				client: {
					brokers: kafkaConfig.kafkaBrokers,
					clientId: kafkaConfig.kafkaClientId,
				},
				consumer: {
					groupId: kafkaConfig.kafkaGroupId,
					minBytes: kafkaConfig.minBytes,
				},
			},
		})
		.then((builder) => builder.addDefaults().build());

	await app.listen();

	logger.debug("Application is running.");
}
bootstrap();
