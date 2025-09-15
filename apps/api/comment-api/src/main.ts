import { Logger } from "@nestjs/common";
import { NestAppConfigBuilderFactory } from "@ovp-lib/api/config/builders/nest-app-config-builder";

import { AppModule } from "~src/app.module";
import { AppConfig } from "~src/config/providers/app.config";

const logger = new Logger("bootstrap");

async function bootstrap() {
	const configBuilder = await NestAppConfigBuilderFactory.create(AppModule);

	const appConfig = configBuilder.getProvider(AppConfig);
	const app = configBuilder.addDefaults().addSwagger("Comment API Specification").build();

	await app.listen(appConfig.port);

	logger.debug(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
