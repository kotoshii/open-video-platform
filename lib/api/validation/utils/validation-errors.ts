import { BadRequestException } from "@nestjs/common";
import { ValidationError } from "class-validator";

export function groupValidationErrors(errors: ValidationError[], parentProperty = "") {
	const grouped: Record<string, string[]> = {};

	for (const error of errors) {
		const propertyName = parentProperty ? `${parentProperty}.${error.property}` : error.property;

		if (error.constraints) {
			grouped[propertyName] = Object.values(error.constraints);
		}

		if (error.children?.length) {
			const groupedChildren = groupValidationErrors(error.children, propertyName);
			Object.assign(grouped, groupedChildren);
		}
	}

	return grouped;
}

export function createValidationException(errors: ValidationError[]) {
	const groupedErrors = groupValidationErrors(errors);

	return new BadRequestException({
		message: groupedErrors,
		error: "Bad Request",
		statusCode: 400,
	});
}
