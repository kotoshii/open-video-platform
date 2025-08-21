import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ICommonJwtConfig } from "~config/interfaces/common-jwt-config.interface";

@Injectable()
export class CommonJwtConfig implements ICommonJwtConfig {
	constructor(protected config: ConfigService) {}

	get jwtSecret(): string {
		return this.config.get<string>("JWT_SECRET", "");
	}

	get jwtExpiresIn(): string {
		return this.config.get<string>("JWT_EXPIRES_IN", "");
	}
}
