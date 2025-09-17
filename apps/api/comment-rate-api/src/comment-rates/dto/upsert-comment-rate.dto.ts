import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

import { CommentRateType } from "~db/schema";

export class UpsertCommentRateDto {
	@IsEnum(CommentRateType)
	@IsNotEmpty()
	@ApiProperty({ enum: CommentRateType })
	type: CommentRateType;
}
