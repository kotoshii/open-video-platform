import { createParamDecorator, ExecutionContext, Type } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Request } from "express";

import { PaginationOptionsDto } from "~pagination/dto/pagination-options.dto";
import { validateInstance } from "~validation/utils/validation-helpers";

export const Pagination = <TPaginationOptionsDto extends PaginationOptionsDto>(DtoClass: Type<TPaginationOptionsDto>) =>
	createParamDecorator(async (_, ctx: ExecutionContext) => {
		const req: Request = ctx.switchToHttp().getRequest();

		const dto = plainToInstance(DtoClass, Object.assign({}, req.query), {
			enableImplicitConversion: true,
			exposeDefaultValues: true,
		});

		await validateInstance(dto);

		return dto;
	})();
