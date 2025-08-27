import { applyDecorators, HttpStatus, Type } from "@nestjs/common";
import { ApiExtraModels, ApiQuery, ApiResponse, ApiResponseOptions, getSchemaPath } from "@nestjs/swagger";

import { PaginatedResponseDto } from "~pagination/dto/paginated-response.dto";
import { PaginationOptionsDto } from "~pagination/dto/pagination-options.dto";

type ApiPaginatedResponseOptions = Omit<ApiResponseOptions, "schema" | "type">;

export const ApiPaginatedResponse = <TModel extends Type>(model: TModel, options: ApiPaginatedResponseOptions = {}) => {
	const { description = "Successfully received model list", status = HttpStatus.OK, ...restOptions } = options;

	return applyDecorators(
		ApiExtraModels(model),
		ApiExtraModels(PaginatedResponseDto),
		ApiQuery({ type: PaginationOptionsDto }),
		ApiResponse({
			description,
			status,
			...restOptions,
			schema: {
				allOf: [
					{ $ref: getSchemaPath(PaginatedResponseDto) },
					{
						properties: {
							data: {
								type: "array",
								items: { $ref: getSchemaPath(model) },
							},
						},
					},
				],
			},
		}),
	);
};
