import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateChannelDto {
	@MaxLength(255)
	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	name?: string;

	@MaxLength(1024)
	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	description?: string;
}
