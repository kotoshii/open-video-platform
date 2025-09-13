import { applyDecorators, HttpStatus, Type } from "@nestjs/common";
import { ApiExtraModels, ApiQuery, ApiResponse, ApiResponseOptions, getSchemaPath } from "@nestjs/swagger";

import { PaginatedResponseDto } from "~pagination/dto/paginated-response.dto";

type ApiPaginatedResponseOptions = Omit<ApiResponseOptions, "schema" | "type">;

export const ApiPaginatedResponse = (
	EntityDtoClass: Type,
	QueryDtoClass: Type,
	options: ApiPaginatedResponseOptions = {},
) => {
	const { description = "Successfully received model list", status = HttpStatus.OK, ...restOptions } = options;

	return applyDecorators(
		ApiExtraModels(EntityDtoClass),
		ApiExtraModels(PaginatedResponseDto),
		ApiQuery({ type: QueryDtoClass }),
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
								items: { $ref: getSchemaPath(EntityDtoClass) },
							},
						},
					},
				],
			},
		}),
	);
};
