import { CreateUserRequest } from "@ovp-proto/types/users";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserGrpcRequestDto implements CreateUserRequest {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsDate()
	@IsNotEmpty()
	dateOfBirth: Date;

	@IsString()
	@IsNotEmpty()
	password: string;
}
