import { ApiProperty } from "@nestjs/swagger";
import { IsMimeType, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

export class CreateVideoUploadDto {
	@MaxLength(255)
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: "Original file name" })
	name: string;

	@Min(0)
	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ description: "Original file size in bytes" })
	size: number;

	@IsMimeType()
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: "Original file mime type" })
	type: string;
}
