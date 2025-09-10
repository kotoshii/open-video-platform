import { Transform } from "class-transformer";

export function ExposeIf<T extends object>(callback: (obj: T) => boolean) {
	return <K extends keyof T>(target: T, propertyKey: K) => {
		Transform(
			({ obj, value }) => {
				const shouldExpose = callback(obj);
				return shouldExpose ? value : undefined;
			},
			{ toPlainOnly: true },
		)(target, propertyKey as string | symbol);
	};
}
