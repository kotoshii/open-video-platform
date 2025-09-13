import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationOrder } from "@ovp-lib/api/pagination/decorators/pagination-order.decorator";
import { PaginationOrderBy } from "@ovp-lib/api/pagination/decorators/pagination-order-by.decorator";
import { PaginationOptionsDto } from "@ovp-lib/api/pagination/dto/pagination-options.dto";
import { SortOrder } from "@ovp-lib/common/constants/sort-order";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { Selectable } from "kysely";

import { Video } from "~db/schema";
import { VideoSortingForChannel } from "~src/videos/constants/video-sorting";

interface OrderSettings {
	field: keyof Selectable<Video>;
	direction: SortOrder;
}

// default: VideoSortingForChannel.Newest
const DEFAULT_ORDER_SETTINGS: OrderSettings = { field: "createdDate", direction: SortOrder.Desc };

const getOrderSettingsFromSorting = (obj: GetVideosForChannelPaginationOptionsDto): OrderSettings => {
	if (obj.sorting === VideoSortingForChannel.Newest) return { field: "createdDate", direction: SortOrder.Desc };
	if (obj.sorting === VideoSortingForChannel.MostViewed) return { field: "viewCount", direction: SortOrder.Desc };
	if (obj.sorting === VideoSortingForChannel.Oldest) return { field: "createdDate", direction: SortOrder.Asc };

	return DEFAULT_ORDER_SETTINGS;
};

export class GetVideosForChannelPaginationOptionsDto extends PaginationOptionsDto {
	@IsEnum(VideoSortingForChannel)
	@IsOptional()
	@ApiPropertyOptional({ enum: VideoSortingForChannel, default: VideoSortingForChannel.Newest })
	sorting: VideoSortingForChannel = VideoSortingForChannel.Newest;

	@Transform(({ obj }) => getOrderSettingsFromSorting(obj).direction)
	@PaginationOrder(DEFAULT_ORDER_SETTINGS.direction, { swagger: false })
	order: SortOrder = DEFAULT_ORDER_SETTINGS.direction;

	@Transform(({ obj }) => getOrderSettingsFromSorting(obj).field)
	@PaginationOrderBy(DEFAULT_ORDER_SETTINGS.field, { swagger: false })
	orderBy: keyof Selectable<Video> = DEFAULT_ORDER_SETTINGS.field;
}
