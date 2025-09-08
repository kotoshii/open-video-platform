import { CanAccessNsfwRequest } from "@ovp-proto/types/users";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CanAccessNsfwGrpcRequestDto implements CanAccessNsfwRequest {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	userId: string;
}
