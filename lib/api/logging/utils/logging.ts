import { SENSITIVE_FIELDS } from "~logging/constants/logging";

/**
 * Recursively masks sensitive fields in an object by replacing their values with asterisks (`****`).
 * Useful for safely logging request data without exposing secrets like passwords or tokens.
 * @example
 * maskSensitiveData({ password: '123456', email: 'test@example.com' })
 * // returns { password: '****', email: 'test@example.com' }
 */
export function maskSensitiveData<T>(obj: T): T {
	if (Array.isArray(obj)) {
		return obj.map(maskSensitiveData) as T;
	}

	if (obj !== null && typeof obj === "object") {
		const result: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(obj)) {
			result[key] = SENSITIVE_FIELDS.includes(key) ? "****" : maskSensitiveData(value);
		}

		return result as T;
	}

	return obj;
}
