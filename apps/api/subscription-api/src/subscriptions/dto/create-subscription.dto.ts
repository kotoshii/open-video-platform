import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateSubscriptionDto {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	channelId: string;
}
