import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenDto {
	constructor(accessToken: string) {
		this.accessToken = accessToken;
	}

	@ApiProperty({ description: "JWT access token" })
	accessToken: string;
}
