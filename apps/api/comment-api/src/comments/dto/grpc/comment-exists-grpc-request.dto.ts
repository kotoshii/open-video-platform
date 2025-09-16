import { CommentExistsRequest } from "@ovp-proto/types/comments";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CommentExistsGrpcRequestDto implements CommentExistsRequest {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	commentId: string;
}
