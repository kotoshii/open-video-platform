import { ReflectionService } from "@grpc/reflection";
import { Logger } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";
import { NestAppConfigBuilderFactory } from "@ovp-lib/api/config/builders/nest-app-config-builder";
import { ProtoPaths } from "@ovp-proto/types/utils/paths";
import { VIDEOS_PACKAGE_NAME } from "@ovp-proto/types/videos";

import { AppModule } from "~src/app.module";
import { AppConfig } from "~src/config/providers/app.config";
import { GrpcConfig } from "~src/config/providers/grpc.config";

const logger = new Logger("bootstrap");

async function bootstrap() {
	const configBuilder = await NestAppConfigBuilderFactory.create(AppModule);

	const appConfig = configBuilder.getProvider(AppConfig);
	const grpcConfig = configBuilder.getProvider(GrpcConfig);

	const app = configBuilder
		.addDefaults()
		.addSwagger("Video API Specification")
		.addMicroservice({
			transport: Transport.GRPC,
			options: {
				package: VIDEOS_PACKAGE_NAME,
				url: grpcConfig.grpcUrl,
				protoPath: ProtoPaths.Videos,
				onLoadPackageDefinition: (pkg, server) => {
					new ReflectionService(pkg).addToServer(server);
				},
			},
		})
		.build();

	await app.startAllMicroservices();
	await app.listen(appConfig.port);

	logger.debug(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
