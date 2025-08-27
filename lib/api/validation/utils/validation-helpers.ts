import { validate } from "class-validator";

import { createValidationException } from "~validation/utils/validation-errors";

export async function validateInstance(instance: object) {
	const errors = await validate(instance);

	if (errors.length > 0) {
		throw createValidationException(errors);
	}
}

export async function validateInstances(instances: object[]) {
	const errors = (await Promise.all(instances.map((instance) => validate(instance)))).flat();

	if (errors.length > 0) {
		throw createValidationException(errors);
	}
}
