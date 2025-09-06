export async function runCatching<T>(fn: () => T | Promise<T>): Promise<T | null> {
	try {
		return await fn();
	} catch (_) {
		return null;
	}
}
