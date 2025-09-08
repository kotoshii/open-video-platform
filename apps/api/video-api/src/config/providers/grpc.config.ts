import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommonGrpcConfig } from "@ovp-lib/api/config/providers/common-grpc.config";

@Injectable()
export class GrpcConfig extends CommonGrpcConfig {
	// biome-ignore lint/complexity/noUselessConstructor: needed for cross-package inheritance
	constructor(config: ConfigService) {
		super(config);
	}

	override get grpcUrl() {
		return this.config.get<string>("GRPC_URL", "0.0.0.0:5005");
	}

	get grpcUserServiceUrl() {
		return this.config.get<string>("GRPC_USER_SERVICE_URL", "0.0.0.0:5001");
	}

	get grpcChannelServiceUrl() {
		return this.config.get<string>("GRPC_CHANNEL_SERVICE_URL", "0.0.0.0:5002");
	}
}
