import * as crypto from "node:crypto";

import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenPayload } from "@ovp-lib/api/auth/types/access-token-payload";
import { StringHasher } from "@ovp-lib/common/utils/string-hasher";
import ms from "ms";

import { AuthSessionConfig } from "~src/config/providers/auth-session.config";
import { TokenRepository } from "~src/tokens/repositories/token.repository";

const MAX_REFRESH_TOKEN_GENERATION_ATTEMPTS = 10;

@Injectable()
export class TokenService {
	private readonly stringHasher = new StringHasher();

	constructor(
		private readonly tokenRepository: TokenRepository,
		private readonly authSessionConfig: AuthSessionConfig,
		private readonly jwtService: JwtService,
	) {}

	async issueNewRefreshToken(authSessionId: string) {
		const expiresInMs = ms(this.authSessionConfig.refreshTokenExpiresIn as ms.StringValue);
		const expiresAt = new Date(Date.now() + expiresInMs);

		const { refreshToken, refreshTokenHash } = await this.attemptGenerateNewRefreshToken();
		await this.tokenRepository.createRefreshToken({
			authSessionId,
			refreshTokenHash,
			expiresAt,
		});

		return refreshToken;
	}

	async issueNewAccessToken(payload: AccessTokenPayload) {
		return this.jwtService.signAsync(payload);
	}

	private async attemptGenerateNewRefreshToken() {
		for (let attempts = 1; attempts <= MAX_REFRESH_TOKEN_GENERATION_ATTEMPTS; attempts++) {
			const refreshToken = crypto.randomUUID();
			const refreshTokenHash = await this.stringHasher.hash(refreshToken);

			const existingToken = await this.tokenRepository.getRefreshTokenByHash(refreshTokenHash);

			if (existingToken) {
				continue;
			}

			return { refreshToken, refreshTokenHash };
		}

		throw new Error(`Failed to generate a new refresh token after ${MAX_REFRESH_TOKEN_GENERATION_ATTEMPTS} attempts`);
	}
}
