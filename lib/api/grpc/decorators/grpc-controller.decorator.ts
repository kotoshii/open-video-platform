import { applyDecorators, Controller, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ControllerOptions } from "@nestjs/common/decorators/core/controller.decorator";

import { HttpToGrpcExceptionFilter } from "~grpc/filters/http-to-grpc-exception.filter";
import { RpcLoggingInterceptor } from "~logging/interceptors/rpc-logging.interceptor";

export function GrpcController(prefixOrOptions?: string | string[] | ControllerOptions) {
	return applyDecorators(
		// biome-ignore lint/suspicious/noExplicitAny: complex overload
		Controller(prefixOrOptions as any),
		UseInterceptors(RpcLoggingInterceptor),
		UseFilters(HttpToGrpcExceptionFilter),
		UsePipes(
			new ValidationPipe({
				whitelist: true,
				transform: true,
				transformOptions: { enableImplicitConversion: true },
			}),
		),
	);
}
