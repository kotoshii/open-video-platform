import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Request } from "express";

import { PaginationOptionsDto } from "~pagination/dto/pagination-options.dto";
import { validateInstance } from "~validation/utils/validation-helpers";

type OverridablePaginationOptions<TEntity> = Partial<
	Omit<PaginationOptionsDto<TEntity>, "page" | "offset" | "maxLimit">
>;

interface PaginationConfigOptions {
	maxLimit?: number;
}

interface PaginationConfig<TEntity> {
	defaults?: OverridablePaginationOptions<TEntity>;
	overrides?: OverridablePaginationOptions<TEntity>;
	options?: PaginationConfigOptions;
}

export const Pagination = createParamDecorator(
	async <TEntity = object>(paginationConfig: PaginationConfig<TEntity> = {}, ctx: ExecutionContext) => {
		const req: Request = ctx.switchToHttp().getRequest();
		const { defaults, overrides, options = {} } = paginationConfig;

		const dto = plainToInstance(PaginationOptionsDto, Object.assign({}, defaults, req.query, overrides, options), {
			enableImplicitConversion: true,
			exposeDefaultValues: true,
		});

		await validateInstance(dto);

		return dto;
	},
);
