import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { Updateable } from "kysely";

import { Comment } from "~db/schema";

export class UpdateCommentDto {
	@MaxLength(2048)
	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	content?: string;

	toPlain(): Updateable<Comment> {
		return {
			content: this.content,
		};
	}
}
