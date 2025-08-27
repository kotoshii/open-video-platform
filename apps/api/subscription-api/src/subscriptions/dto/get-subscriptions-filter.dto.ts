import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetSubscriptionsFilterDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	search: string;
}
