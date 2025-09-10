import { Transform } from "class-transformer";

export function ExcludeIf<T extends object>(callback: (obj: T) => boolean) {
	return <K extends keyof T>(target: T, propertyKey: K) => {
		Transform(
			({ obj, value }) => {
				const shouldExclude = callback(obj);
				return shouldExclude ? undefined : value;
			},
			{ toPlainOnly: true },
		)(target, propertyKey as string | symbol);
	};
}
