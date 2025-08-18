import { UserExistsRequest } from "@ovp-proto/types/users";
import { IsEmail, IsOptional, IsString, IsUUID } from "class-validator";

export class UserExistsGrpcRequestDto implements UserExistsRequest {
	@IsUUID()
	@IsString()
	@IsOptional()
	userId?: string;

	@IsEmail()
	@IsString()
	@IsOptional()
	email?: string;
}
