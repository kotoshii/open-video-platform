import { applyDecorators } from "@nestjs/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional } from "class-validator";

import { HidePaginationOption } from "~pagination/decorators/hide-pagination-option.decorator";
import { MaxLimit } from "~pagination/decorators/max-limit.decorator";
import { CommonPaginationFieldDecoratorOptions } from "~pagination/types/common-pagination-field-decorator-options";

interface PaginationLimitOptions extends CommonPaginationFieldDecoratorOptions {}

export const PaginationLimit = (defaultLimit = 50, options: PaginationLimitOptions = {}) => {
	const { swagger = true } = options;
	const decorators = [IsInt(), IsOptional(), MaxLimit(defaultLimit)];

	if (swagger) {
		decorators.push(ApiPropertyOptional({ type: "number", default: defaultLimit }));
	} else {
		decorators.push(HidePaginationOption());
	}

	return applyDecorators(...decorators);
};
