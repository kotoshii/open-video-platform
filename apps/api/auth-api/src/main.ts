import { Logger } from "@nestjs/common";
import { NestAppConfigBuilderFactory } from "@ovp-lib/api/config/builders/nest-app-config-builder";

import { AppModule } from "~src/app.module";
import { AppConfig } from "~src/config/providers/app.config";

const logger = new Logger("bootstrap");

async function bootstrap() {
	const configBuilder = await NestAppConfigBuilderFactory.create(AppModule);

	const app = configBuilder
		.provideConfig(AppConfig)
		.setGlobalPrefix()
		.addCors()
		.addDefaults()
		.addSwagger("Auth API Specification")
		.build();

	await app.listen(configBuilder.lookupConfigValue("port") as number);

	logger.debug(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
