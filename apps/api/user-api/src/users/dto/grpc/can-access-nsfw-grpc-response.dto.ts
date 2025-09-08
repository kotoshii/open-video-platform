import { CanAccessNsfwResponse } from "@ovp-proto/types/users";

export class CanAccessNsfwGrpcResponseDto implements CanAccessNsfwResponse {
	constructor(canAccessNsfw: boolean) {
		this.canAccessNsfw = canAccessNsfw;
	}

	canAccessNsfw: boolean;
}
