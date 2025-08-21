import * as bcrypt from "bcrypt";

export class StringHasher {
	private readonly DEFAULT_SALT_ROUNDS = 12;

	/**
	 * Hash a string using bcrypt
	 * @param value - Plain text value
	 * @param saltRounds - Cost factor (10-15, default: 12)
	 * @returns Promise resolving to hashed string
	 */
	async hash(value: string, saltRounds: number = this.DEFAULT_SALT_ROUNDS): Promise<string> {
		try {
			return await bcrypt.hash(value, saltRounds);
		} catch (error) {
			throw new Error(`String hashing failed: ${error.message}`);
		}
	}

	/**
	 * Verify string against bcrypt hash
	 * @param value - Plain text value
	 * @param hash - Bcrypt hash to verify against
	 * @returns Promise resolving to boolean
	 */
	async verify(value: string, hash: string): Promise<boolean> {
		if (!value || !hash) {
			return false;
		}

		// Basic hash format validation (bcrypt hashes start with $2a$, $2b$, or $2y$)
		if (!hash.match(/^\$2[abyxy]\$\d{2}\$.{53}$/)) {
			return false;
		}

		try {
			return await bcrypt.compare(value, hash);
		} catch (error) {
			// Log error but don't expose details
			console.error("String hash verification error:", error.message);
			return false;
		}
	}
}
