import { applyDecorators, Controller, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { ControllerOptions } from "@nestjs/common/decorators/core/controller.decorator";

import { Http2GrpcExceptionFilter } from "~common/filters/http2-grpc-exception.filter";

export function GrpcController(prefixOrOptions?: string | string[] | ControllerOptions) {
	return applyDecorators(
		// biome-ignore lint/suspicious/noExplicitAny: complex overload
		Controller(prefixOrOptions as any),
		UseFilters(Http2GrpcExceptionFilter),
		UsePipes(new ValidationPipe({ transform: true })),
	);
}
