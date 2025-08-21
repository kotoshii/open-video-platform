import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsDate()
	@IsNotEmpty()
	dateOfBirth: Date;

	@IsString()
	@IsNotEmpty()
	passwordHash: string;
}
