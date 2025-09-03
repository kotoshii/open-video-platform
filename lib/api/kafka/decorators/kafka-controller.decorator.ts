import { applyDecorators, Controller, UsePipes, ValidationPipe } from "@nestjs/common";
import { ControllerOptions } from "@nestjs/common/decorators/core/controller.decorator";

export function KafkaController(prefixOrOptions?: string | string[] | ControllerOptions) {
	return applyDecorators(
		// biome-ignore lint/suspicious/noExplicitAny: complex overload
		Controller(prefixOrOptions as any),
		UsePipes(
			new ValidationPipe({
				whitelist: true, // todo move validation pipe creation with these defaults to some helper
				transform: true,
				transformOptions: { enableImplicitConversion: true },
			}),
		),
	);
}
