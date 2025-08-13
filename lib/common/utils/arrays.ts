import { MaybeArray } from "~types/maybe-array";

export function toArray<T>(maybeArray: MaybeArray<T>) {
	return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}
