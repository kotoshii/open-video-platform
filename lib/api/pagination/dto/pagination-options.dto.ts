import { SortOrder } from "@ovp-lib/common/constants/sort-order";

import { PaginationLimit } from "~pagination/decorators/pagination-limit.decorator";
import { PaginationOrder } from "~pagination/decorators/pagination-order.decorator";
import { PaginationOrderBy } from "~pagination/decorators/pagination-order-by.decorator";
import { PaginationPage } from "~pagination/decorators/pagination-page.decorator";

export abstract class PaginationOptionsDto {
	@PaginationPage()
	readonly page: number = 1;

	@PaginationLimit(50)
	readonly limit: number = 50;

	@PaginationOrder()
	readonly order: SortOrder;

	@PaginationOrderBy()
	readonly orderBy: string;

	get offset(): number {
		return (this.page - 1) * this.limit;
	}
}
