import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateChannelDto {
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	name: string;

	@MaxLength(1024)
	@IsString()
	@IsOptional()
	description?: string;
}
