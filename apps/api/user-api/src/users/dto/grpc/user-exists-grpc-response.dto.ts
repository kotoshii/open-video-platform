import { UserExistsResponse } from "@ovp-proto/types/users";

export class UserExistsGrpcResponseDto implements UserExistsResponse {
	constructor(exists: boolean) {
		this.exists = exists;
	}

	exists: boolean;
}
