import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthenticateChannelDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	channelId: string;
}
