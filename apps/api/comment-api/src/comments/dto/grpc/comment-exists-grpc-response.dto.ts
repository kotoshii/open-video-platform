import { CommentExistsResponse } from "@ovp-proto/types/comments";

export class CommentExistsGrpcResponseDto implements CommentExistsResponse {
	constructor(exists: boolean) {
		this.exists = exists;
	}

	exists: boolean;
}
