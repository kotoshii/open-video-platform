import { UserAuthenticationDetailsResponse } from "@ovp-proto/types/users";

export class UserAuthDetailsGrpcResponseDto implements UserAuthenticationDetailsResponse {
	constructor(valid: boolean, userId?: string) {
		this.valid = valid;
		this.userId = userId;
	}

	valid: boolean;

	userId?: string;
}
