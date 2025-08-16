import { applyDecorators, Controller, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ControllerOptions } from "@nestjs/common/decorators/core/controller.decorator";

import { Http2GrpcExceptionFilter } from "~common/filters/http2-grpc-exception.filter";
import { RpcLoggingInterceptor } from "~common/interceptors/rpc-logging.interceptor";

export function GrpcController(prefixOrOptions?: string | string[] | ControllerOptions) {
	return applyDecorators(
		// biome-ignore lint/suspicious/noExplicitAny: complex overload
		Controller(prefixOrOptions as any),
		UseInterceptors(RpcLoggingInterceptor),
		UseFilters(Http2GrpcExceptionFilter),
		UsePipes(
			new ValidationPipe({
				whitelist: true,
				transform: true,
				transformOptions: { enableImplicitConversion: true },
			}),
		),
	);
}
