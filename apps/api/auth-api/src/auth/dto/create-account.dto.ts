import { ApiProperty } from "@nestjs/swagger";
import { IsStrongPassword } from "@ovp-lib/api/validation/decorators/is-strong-password.decorator";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAccountDto {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	channelName: string;

	@IsDate()
	@IsNotEmpty()
	@ApiProperty()
	dateOfBirth: Date;

	@IsStrongPassword()
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	password: string;
}
