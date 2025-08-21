import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GrpcConfig {
	constructor(private readonly config: ConfigService) {}

	get grpcUserServiceUrl() {
		return this.config.get<string>("GRPC_USER_SERVICE_URL", "0.0.0.0:5001");
	}

	get grpcChannelServiceUrl() {
		return this.config.get<string>("GRPC_CHANNEL_SERVICE_URL", "0.0.0.0:5002");
	}
}
