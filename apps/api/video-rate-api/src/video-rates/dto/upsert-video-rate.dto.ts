import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

import { VideoRateType } from "~db/schema";

export class UpsertVideoRateDto {
	@IsEnum(VideoRateType)
	@IsNotEmpty()
	@ApiProperty({ enum: VideoRateType })
	type: VideoRateType;
}
