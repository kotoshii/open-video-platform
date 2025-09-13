import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsArray } from "class-validator";

import { PaginationOptionsDto } from "~pagination/dto/pagination-options.dto";

export class PageMetaDto {
	constructor(page: number, limit: number, itemCount: number) {
		this.page = page;
		this.limit = limit;
		this.itemCount = itemCount;
	}

	@ApiProperty({ type: "number" })
	page: number;

	@ApiProperty({ type: "number" })
	limit: number;

	@ApiProperty({ type: "number" })
	itemCount: number;

	@Expose()
	@ApiProperty({ type: "number" })
	get pageCount(): number {
		return Math.ceil(this.itemCount / this.limit);
	}

	@Expose()
	@ApiProperty({ type: "boolean" })
	get hasPreviousPage(): boolean {
		const prevPage = this.page - 1;
		return prevPage > 1 && prevPage <= this.pageCount;
	}

	@Expose()
	@ApiProperty({ type: "boolean" })
	get hasNextPage(): boolean {
		return this.page < this.pageCount;
	}
}

export class PaginatedResponseDto<TEntity> {
	@IsArray()
	@ApiProperty({ isArray: true, type: "array" })
	data: TEntity[];

	@ApiProperty({ type: PageMetaDto })
	meta: PageMetaDto;

	constructor(data: TEntity[], pagination: PaginationOptionsDto, itemCount: number) {
		const { page, limit } = pagination;

		this.data = data;
		this.meta = new PageMetaDto(page, limit, itemCount);
	}
}
