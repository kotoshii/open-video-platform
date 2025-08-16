import { CreateUserRequest } from "@ovp-proto/types/users";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto implements CreateUserRequest {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsDate()
	@IsNotEmpty()
	dateOfBirth: Date;

	// TODO: Add password strength validation via custom decorator
	@IsString()
	@IsNotEmpty()
	password: string;
}
