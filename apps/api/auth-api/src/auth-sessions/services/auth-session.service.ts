import { Inject, Injectable } from "@nestjs/common";
import { JWT_CONFIG_INJECTION_TOKEN } from "@ovp-lib/api/config/constants/injection-tokens";
import ms from "ms";

import { GetAuthSessionDto } from "~src/auth-sessions/dto/get-auth-session.dto";
import { AuthSessionRepository } from "~src/auth-sessions/repositories/auth-session.repository";
import { JwtConfig } from "~src/config/providers/jwt.config";

@Injectable()
export class AuthSessionService {
	constructor(
		private readonly authSessionRepository: AuthSessionRepository,
		@Inject(JWT_CONFIG_INJECTION_TOKEN) private readonly jwtConfig: JwtConfig,
	) {}

	async createAuthSession(
		userId: string,
		channelId: string,
		countryCode: string | null,
		countryName: string | null,
		cityName: string | null,
		ipAddress: string | null,
		userAgent: string | null,
	) {
		const expiresInMs = ms(this.jwtConfig.jwtExpiresIn as ms.StringValue);
		const expiresAt = new Date(Date.now() + expiresInMs);

		const authSession = await this.authSessionRepository.createAuthSession({
			userId,
			channelId,
			countryCode,
			countryName,
			cityName,
			ipAddress,
			userAgent,
			expiresAt,
		});

		return new GetAuthSessionDto(authSession);
	}

	async deleteAuthSessionById(sessionId: string) {
		await this.authSessionRepository.deleteAuthSessionById(sessionId);
	}
}
