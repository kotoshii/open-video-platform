import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthSessionConfig {
	constructor(private readonly config: ConfigService) {}

	get refreshTokenExpiresIn() {
		return this.config.get<string>("REFRESH_TOKEN_EXPIRES_IN", "30d");
	}
}
