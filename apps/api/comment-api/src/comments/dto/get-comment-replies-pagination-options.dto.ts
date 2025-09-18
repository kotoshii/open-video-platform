import { PaginationLimit } from "@ovp-lib/api/pagination/decorators/pagination-limit.decorator";
import { PaginationOrder } from "@ovp-lib/api/pagination/decorators/pagination-order.decorator";
import { PaginationOrderBy } from "@ovp-lib/api/pagination/decorators/pagination-order-by.decorator";
import { PaginationOptionsDto } from "@ovp-lib/api/pagination/dto/pagination-options.dto";
import { FixedValue } from "@ovp-lib/api/serialization/decorators/fixed-value.decorator";
import { SortOrder } from "@ovp-lib/common/constants/sort-order";
import { Selectable } from "kysely";

import { Comment } from "~db/schema";

export class GetCommentRepliesPaginationOptionsDto extends PaginationOptionsDto {
	@FixedValue(100)
	@PaginationLimit(100, { swagger: false })
	limit: number = 100;

	@FixedValue(SortOrder.Asc)
	@PaginationOrder(SortOrder.Asc, { swagger: false })
	order: SortOrder = SortOrder.Asc;

	@FixedValue("createdDate")
	@PaginationOrderBy("createdDate", { swagger: false })
	orderBy: keyof Selectable<Comment> = "createdDate";
}
