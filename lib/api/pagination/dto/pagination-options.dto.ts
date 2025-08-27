import { ApiPropertyOptional } from "@nestjs/swagger";
import { SortOrder } from "@ovp-lib/common/constants/sort-order";
import { Expose } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export class PaginationOptionsDto<TOrderBy extends string = string> {
	@ApiPropertyOptional({
		minimum: 1,
		default: 1,
		type: "number",
	})
	@IsInt()
	@Min(1)
	@IsOptional()
	@Expose()
	page: number = 1;

	@ApiPropertyOptional({
		default: 20,
		type: "number",
	})
	@IsInt()
	@IsOptional()
	@Expose()
	limit: number = 20;

	@ApiPropertyOptional({ enum: SortOrder, default: SortOrder.Asc })
	@IsEnum(SortOrder)
	@IsOptional()
	@Expose()
	order: SortOrder = SortOrder.Asc;

	@ApiPropertyOptional({ default: "id", type: "string" })
	@IsString()
	@IsOptional()
	@Expose()
	orderBy: TOrderBy = "id" as TOrderBy;

	get offset(): number {
		return (this.page - 1) * this.limit;
	}
}
