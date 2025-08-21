import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommonJwtConfig } from "@ovp-lib/api/config/providers/common-jwt.config";

@Injectable()
export class JwtConfig extends CommonJwtConfig {
	// biome-ignore lint/complexity/noUselessConstructor: needed for cross-package inheritance
	constructor(config: ConfigService) {
		super(config);
	}

	override get jwtExpiresIn(): string {
		return this.config.get<string>("JWT_EXPIRES_IN", "1h");
	}
}
