import { applyDecorators } from "@nestjs/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { SortOrder } from "@ovp-lib/common/constants/sort-order";
import { IsEnum, IsOptional } from "class-validator";

import { HidePaginationOption } from "~pagination/decorators/hide-pagination-option.decorator";
import { CommonPaginationFieldDecoratorOptions } from "~pagination/types/common-pagination-field-decorator-options";

interface PaginationOrderOptions extends CommonPaginationFieldDecoratorOptions {}

export const PaginationOrder = (defaultOrder?: SortOrder, options: PaginationOrderOptions = {}) => {
	const { swagger = true } = options;
	const decorators = [IsEnum(SortOrder), IsOptional()];

	if (swagger) {
		decorators.push(ApiPropertyOptional({ type: "string", enum: SortOrder, default: defaultOrder }));
	} else {
		decorators.push(HidePaginationOption());
	}

	return applyDecorators(...decorators);
};
