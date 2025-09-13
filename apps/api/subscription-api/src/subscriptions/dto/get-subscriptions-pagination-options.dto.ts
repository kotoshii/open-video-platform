import { PaginationLimit } from "@ovp-lib/api/pagination/decorators/pagination-limit.decorator";
import { PaginationOrder } from "@ovp-lib/api/pagination/decorators/pagination-order.decorator";
import { PaginationOrderBy } from "@ovp-lib/api/pagination/decorators/pagination-order-by.decorator";
import { PaginationOptionsDto } from "@ovp-lib/api/pagination/dto/pagination-options.dto";
import { FixedValue } from "@ovp-lib/api/serialization/decorators/fixed-value.decorator";
import { SortOrder } from "@ovp-lib/common/constants/sort-order";
import { Selectable } from "kysely";

import { Subscription } from "~db/schema";

export class GetSubscriptionsPaginationOptionsDto extends PaginationOptionsDto {
	@PaginationLimit(100)
	limit: number = 100;

	@FixedValue(SortOrder.Asc)
	@PaginationOrder(SortOrder.Asc, { swagger: false })
	order: SortOrder = SortOrder.Asc;

	@FixedValue("channelName")
	@PaginationOrderBy("channelName", { swagger: false })
	orderBy: keyof Selectable<Subscription> = "channelName";
}
