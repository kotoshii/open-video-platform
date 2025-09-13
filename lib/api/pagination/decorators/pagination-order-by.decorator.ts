import { applyDecorators } from "@nestjs/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

import { HidePaginationOption } from "~pagination/decorators/hide-pagination-option.decorator";
import { CommonPaginationFieldDecoratorOptions } from "~pagination/types/common-pagination-field-decorator-options";

interface PaginationOrderByOptions extends CommonPaginationFieldDecoratorOptions {}

export const PaginationOrderBy = (defaultOrderBy?: string, options: PaginationOrderByOptions = {}) => {
	const { swagger = true } = options;
	const decorators = [IsString(), IsOptional()];

	if (swagger) {
		decorators.push(ApiPropertyOptional({ type: "string", default: defaultOrderBy }));
	} else {
		decorators.push(HidePaginationOption());
	}

	return applyDecorators(...decorators);
};
