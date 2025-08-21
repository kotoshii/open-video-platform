import { DeleteUserRequest } from "@ovp-proto/types/users";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class DeleteUserGrpcRequestDto implements DeleteUserRequest {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	userId: string;
}
