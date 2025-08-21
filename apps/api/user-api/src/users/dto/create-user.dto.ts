import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsDate()
	@IsNotEmpty()
	dateOfBirth: Date;

	// TODO: Add password strength validation via custom decorator
	// TODO: Move password hashing to auth-api service
	@IsString()
	@IsNotEmpty()
	passwordHash: string;
}
