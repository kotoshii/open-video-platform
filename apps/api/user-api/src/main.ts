import { ReflectionService } from "@grpc/reflection";
import { Logger } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";
import { NestAppConfigBuilderFactory } from "@ovp-lib/api/config/nest-app-config-builder";
import { USERS_PACKAGE_NAME } from "@ovp-proto/types/users";
import { ProtoPaths } from "@ovp-proto/types/utils/paths";

import { AppModule } from "~src/app.module";
import { AppConfig } from "~src/config/providers/app.config";
import { GrpcConfig } from "~src/config/providers/grpc.config";

const logger = new Logger("bootstrap");

async function bootstrap() {
	const configBuilder = await NestAppConfigBuilderFactory.create(AppModule);

	const app = configBuilder
		.provideConfig(AppConfig)
		.provideConfig(GrpcConfig)
		.setGlobalPrefix()
		.addCors()
		.addDefaults()
		.addSwagger("User API Specification")
		.addMicroservice({
			transport: Transport.GRPC,
			options: {
				package: USERS_PACKAGE_NAME,
				url: configBuilder.lookupConfigValue("grpcUrl"),
				protoPath: ProtoPaths.Users,
				onLoadPackageDefinition: (pkg, server) => {
					new ReflectionService(pkg).addToServer(server);
				},
			},
		})
		.build();

	await app.startAllMicroservices();
	await app.listen(configBuilder.lookupConfigValue("port") as number);

	logger.debug(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
