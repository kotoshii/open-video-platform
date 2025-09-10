import { ApiPropertyOptional } from "@nestjs/swagger";
import { SortOrder } from "@ovp-lib/common/constants/sort-order";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export class PaginationOptionsDto<TEntity> {
	readonly maxLimit: number;

	@ApiPropertyOptional({
		minimum: 1,
		default: 1,
		type: "number",
	})
	@IsInt()
	@Min(1)
	@IsOptional()
	readonly page: number = 1;

	@ApiPropertyOptional({
		default: 20,
		type: "number",
	})
	@IsInt()
	@IsOptional()
	@Transform(({ obj, value }) => {
		const limit = parseInt(value) || 0;
		return typeof obj.maxLimit !== "undefined" && limit > obj.maxLimit ? obj.maxLimit : limit;
	})
	limit: number = 20;

	@ApiPropertyOptional({ enum: SortOrder, default: SortOrder.Asc })
	@IsEnum(SortOrder)
	@IsOptional()
	order: SortOrder = SortOrder.Desc;

	@ApiPropertyOptional({ default: "id", type: "string" })
	@IsString()
	@IsOptional()
	orderBy: keyof TEntity = "createdDate" as keyof TEntity;

	get offset(): number {
		return (this.page - 1) * this.limit;
	}
}
