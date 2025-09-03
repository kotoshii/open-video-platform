import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NodeEnv } from "@ovp-lib/common/types/node-env";

import { ICommonAppConfig } from "~config/interfaces/common-app-config.interface";

@Injectable()
export class CommonAppConfig implements ICommonAppConfig {
	constructor(protected config: ConfigService) {}

	get nodeEnv(): NodeEnv {
		return this.config.get<NodeEnv>("NODE_ENV", "local");
	}

	get port() {
		return parseInt(this.config.get<string>("PORT", ""), 10);
	}
}
