import { ClassSerializerInterceptor, Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";

import { AppModule } from "~src/app.module";
import { LoggingInterceptor } from "~src/common/interceptors/logging.interceptor";
import { AppConfig } from "~src/config/providers/app.config";

const logger = new Logger("bootstrap");

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const appConfig = app.get(AppConfig);

	app.setGlobalPrefix("api");

	app.enableCors({ origin: appConfig.corsDomains });

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
		}),
	);

	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	app.useGlobalInterceptors(new LoggingInterceptor());

	await app.listen(appConfig.port);

	logger.debug(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
