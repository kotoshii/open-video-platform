import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Request } from "express";

import { PaginationOptionsDto } from "~pagination/dto/pagination-options.dto";
import { validateInstance } from "~validation/utils/validation-helpers";

type DefaultOverrides<TOrderBy extends string> = Partial<Omit<PaginationOptionsDto<TOrderBy>, "page" | "offset">>;

export const Pagination = createParamDecorator(
	async <TOrderBy extends string = string>(
		defaultOverrides: DefaultOverrides<TOrderBy> = {},
		ctx: ExecutionContext,
	) => {
		const req: Request = ctx.switchToHttp().getRequest();

		const options = plainToInstance(PaginationOptionsDto, Object.assign({}, defaultOverrides, req.query), {
			enableImplicitConversion: true,
			excludeExtraneousValues: true,
			exposeDefaultValues: true,
		});

		await validateInstance(options);

		return options;
	},
);
