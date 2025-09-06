export function jsonParseOrNull<T extends object>(maybeJson: string) {
	try {
		return JSON.parse(maybeJson) as T;
	} catch (e) {
		console.error("Failed to parse JSON", e);
		return null;
	}
}
