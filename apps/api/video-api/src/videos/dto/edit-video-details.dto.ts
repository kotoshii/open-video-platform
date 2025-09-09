import { ApiPropertyOptional } from "@nestjs/swagger";
import { omitUndefined } from "@ovp-lib/common/utils/objects";
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator";
import { Updateable } from "kysely";

import { Video, VideoSelectedThumbnail, VideoVisibility } from "~db/schema";

export class EditVideoDetailsDto {
	@MaxLength(255)
	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	title?: string;

	@MaxLength(4096)
	@IsString()
	@IsOptional()
	@ValidateIf((_, value) => value !== null)
	@ApiPropertyOptional({ type: "string", nullable: true })
	description?: string | null;

	@MaxLength(255, { each: true })
	@IsString({ each: true })
	@IsArray()
	@IsOptional()
	@ApiPropertyOptional()
	tags?: string[];

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional()
	allowComments?: boolean;

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional()
	allowRates?: boolean;

	@IsEnum(VideoSelectedThumbnail)
	@IsOptional()
	@ApiPropertyOptional({ enum: VideoSelectedThumbnail })
	selectedThumbnail?: VideoSelectedThumbnail;

	@IsEnum(VideoVisibility)
	@IsOptional()
	@ApiPropertyOptional({ enum: VideoVisibility })
	visibility?: VideoVisibility;

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional()
	isNsfw?: boolean;

	toPlain(): Updateable<Video> {
		return omitUndefined({
			title: this.title,
			description: this.description,
			tags: this.tags,
			allowComments: this.allowComments,
			allowRates: this.allowRates,
			selectedThumbnail: this.selectedThumbnail,
			visibility: this.visibility,
		});
	}
}
