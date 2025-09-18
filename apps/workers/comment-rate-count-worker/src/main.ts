import { Logger } from "@nestjs/common";
import { NestAppConfigBuilderFactory } from "@ovp-lib/api/config/builders/nest-app-config-builder";

import { AppModule } from "~src/app.module";

const logger = new Logger("bootstrap");

async function bootstrap() {
	const configBuilder = await NestAppConfigBuilderFactory.create(AppModule);

	const app = configBuilder.build();
	await app.init();

	logger.debug("Application is running.");
}
bootstrap();
