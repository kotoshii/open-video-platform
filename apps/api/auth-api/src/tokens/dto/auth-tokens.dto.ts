import { ApiProperty } from "@nestjs/swagger";

export class AuthTokensDto {
	constructor(accessToken: string, refreshToken: string) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}

	@ApiProperty({ description: "JWT access token" })
	accessToken: string;

	// plain refresh token string (i.e. not hashed)
	@ApiProperty({ description: "Plain refresh token string (i.e. not hashed)" })
	refreshToken: string;
}
