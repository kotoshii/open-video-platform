import { Transform } from "class-transformer";

export const MaxLimit = (maxLimit: number) =>
	Transform(({ value }) => {
		const limit = parseInt(value) || 0;
		return limit > maxLimit ? maxLimit : limit;
	});
