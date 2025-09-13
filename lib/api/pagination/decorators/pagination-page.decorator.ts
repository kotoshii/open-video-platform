import { applyDecorators } from "@nestjs/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

import { HidePaginationOption } from "~pagination/decorators/hide-pagination-option.decorator";
import { CommonPaginationFieldDecoratorOptions } from "~pagination/types/common-pagination-field-decorator-options";

interface PaginationPageOptions extends CommonPaginationFieldDecoratorOptions {}

export const PaginationPage = (options: PaginationPageOptions = {}) => {
	const { swagger = true } = options;
	const decorators = [
		IsInt(),
		IsOptional(),
		Transform(({ value }) => {
			const page = parseInt(value);
			return page <= 0 ? 1 : page;
		}),
	];

	if (swagger) {
		decorators.push(ApiPropertyOptional({ type: "number", minimum: 1, default: 1 }));
	} else {
		decorators.push(HidePaginationOption());
	}

	return applyDecorators(...decorators);
};
