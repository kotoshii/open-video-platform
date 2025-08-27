import { Type } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

interface GrpcClientConfig<TGrpcConfig> {
	packageName: string;
	serverUrlKey: keyof TGrpcConfig;
	protoPath: string;
}

export class GrpcClientsModuleConfigBuilderFactory {
	static create<TGrpcConfig>(GrpcConfigClass: Type<TGrpcConfig>) {
		return new GrpcClientsModuleConfigBuilder(GrpcConfigClass);
	}
}

class GrpcClientsModuleConfigBuilder<TGrpcConfig> {
	private readonly clientConfigs: GrpcClientConfig<TGrpcConfig>[] = [];

	constructor(private readonly GrpcConfigClass: Type<TGrpcConfig>) {}

	addClient(packageName: string, serverUrlKey: keyof TGrpcConfig, protoPath: string) {
		this.clientConfigs.push({ packageName, serverUrlKey, protoPath });
		return this;
	}

	build() {
		return ClientsModule.registerAsync(
			this.clientConfigs.map((config) => ({
				name: config.packageName,
				useFactory: (grpcConfig: TGrpcConfig) => ({
					transport: Transport.GRPC,
					options: {
						package: config.packageName,
						url: grpcConfig[config.serverUrlKey] as string,
						protoPath: config.protoPath,
					},
				}),
				inject: [this.GrpcConfigClass],
			})),
		);
	}
}
