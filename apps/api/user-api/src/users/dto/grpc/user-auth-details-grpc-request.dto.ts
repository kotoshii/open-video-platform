import { UserAuthenticationDetailsRequest } from "@ovp-proto/types/users";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserAuthDetailsGrpcRequestDto implements UserAuthenticationDetailsRequest {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
