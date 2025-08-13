import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ICommonGrpcConfig } from "~config/interfaces/common-grpc-config.interface";

@Injectable()
export class CommonGrpcConfig implements ICommonGrpcConfig {
	constructor(protected config: ConfigService) {}

	get grpcUrl() {
		return this.config.get<string>("GRPC_URL", "0.0.0.0:50051");
	}

	get grpcPackage() {
		return this.config.get<string>("GRPC_PACKAGE", "");
	}
}
