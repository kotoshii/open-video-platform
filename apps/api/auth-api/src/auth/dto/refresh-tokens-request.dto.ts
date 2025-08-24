import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokensRequestDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	refreshToken: string;
}
