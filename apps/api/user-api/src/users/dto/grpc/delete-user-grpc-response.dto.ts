import { DeleteUserResponse } from "@ovp-proto/types/users";

export class DeleteUserGrpcResponseDto implements DeleteUserResponse {
	constructor(deleted: boolean) {
		this.deleted = deleted;
	}

	deleted: boolean;
}
