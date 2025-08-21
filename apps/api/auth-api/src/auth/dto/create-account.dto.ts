import { IsStrongPassword } from "@ovp-lib/api/validation/decorators/is-strong-password.decorator";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAccountDto {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	channelName: string;

	@IsDate()
	@IsNotEmpty()
	dateOfBirth: Date;

	@IsStrongPassword()
	@IsString()
	@IsNotEmpty()
	password: string;
}
