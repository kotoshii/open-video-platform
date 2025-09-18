import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationLimit } from "@ovp-lib/api/pagination/decorators/pagination-limit.decorator";
import { PaginationOrder } from "@ovp-lib/api/pagination/decorators/pagination-order.decorator";
import { PaginationOrderBy } from "@ovp-lib/api/pagination/decorators/pagination-order-by.decorator";
import { PaginationOptionsDto } from "@ovp-lib/api/pagination/dto/pagination-options.dto";
import { FixedValue } from "@ovp-lib/api/serialization/decorators/fixed-value.decorator";
import { SortOrder } from "@ovp-lib/common/constants/sort-order";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { Selectable } from "kysely";

import { Comment } from "~db/schema";
import { CommentSorting } from "~src/comments/constants/comment-sorting";

interface OrderSettings {
	field: keyof Selectable<Comment>;
	direction: SortOrder;
}

// default: CommentSorting.Newest
const DEFAULT_ORDER_SETTINGS: OrderSettings = { field: "createdDate", direction: SortOrder.Desc };

const getOrderSettingsFromSorting = (obj: GetCommentsPaginationOptionsDto): OrderSettings => {
	if (obj.sorting === CommentSorting.Newest) return { field: "createdDate", direction: SortOrder.Desc };
	if (obj.sorting === CommentSorting.Oldest) return { field: "createdDate", direction: SortOrder.Asc };
	if (obj.sorting === CommentSorting.MostLikes) return { field: "likes", direction: SortOrder.Desc };
	if (obj.sorting === CommentSorting.MostDislikes) return { field: "dislikes", direction: SortOrder.Desc };

	return DEFAULT_ORDER_SETTINGS;
};

export class GetCommentsPaginationOptionsDto extends PaginationOptionsDto {
	@IsEnum(CommentSorting)
	@IsOptional()
	@ApiPropertyOptional({ enum: CommentSorting, default: CommentSorting.Newest })
	sorting: CommentSorting = CommentSorting.Newest;

	@FixedValue(50)
	@PaginationLimit(50, { swagger: false })
	limit: number = 50;

	@Transform(({ obj }) => getOrderSettingsFromSorting(obj).direction)
	@PaginationOrder(DEFAULT_ORDER_SETTINGS.direction, { swagger: false })
	order: SortOrder = DEFAULT_ORDER_SETTINGS.direction;

	@Transform(({ obj }) => getOrderSettingsFromSorting(obj).field)
	@PaginationOrderBy(DEFAULT_ORDER_SETTINGS.field, { swagger: false })
	orderBy: keyof Selectable<Comment> = DEFAULT_ORDER_SETTINGS.field;
}
