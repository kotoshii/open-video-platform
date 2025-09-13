import "reflect-metadata";

import { DECORATORS } from "@nestjs/swagger/dist/constants";

export const ClearSwaggerPropertyMetadata = () => {
	// biome-ignore lint/suspicious/noExplicitAny: <may be literally anything, cannot predict the type >
	return (target: any, propertyKey: string | symbol) => {
		const properties = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, target) as string[];
		const filtered = properties.filter((property) => property !== `:${propertyKey.toString()}`);

		Reflect.defineMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, filtered, target);
		Reflect.deleteMetadata(DECORATORS.API_MODEL_PROPERTIES, target, propertyKey);
	};
};
