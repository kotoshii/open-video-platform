import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetVideosForChannelFilterDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	search: string;
}
