import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateCommentDto {
	@MaxLength(2048)
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	content: string;

	@IsUUID()
	@IsOptional()
	@ApiPropertyOptional()
	parentId?: string;
}
