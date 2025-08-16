import * as bcrypt from "bcrypt";

export class PasswordHasher {
	private readonly DEFAULT_SALT_ROUNDS = 12;

	/**
	 * Hash a password using bcrypt
	 * @param password - Plain text password
	 * @param saltRounds - Cost factor (10-15, default: 12)
	 * @returns Promise resolving to hashed password
	 */
	async hash(password: string, saltRounds: number = this.DEFAULT_SALT_ROUNDS): Promise<string> {
		try {
			return await bcrypt.hash(password, saltRounds);
		} catch (error) {
			throw new Error(`Password hashing failed: ${error.message}`);
		}
	}

	/**
	 * Verify password against bcrypt hash
	 * @param password - Plain text password
	 * @param hash - Bcrypt hash to verify against
	 * @returns Promise resolving to boolean
	 */
	async verify(password: string, hash: string): Promise<boolean> {
		if (!password || !hash) {
			return false;
		}

		// Basic hash format validation (bcrypt hashes start with $2a$, $2b$, or $2y$)
		if (!hash.match(/^\$2[abyxy]\$\d{2}\$.{53}$/)) {
			return false;
		}

		try {
			return await bcrypt.compare(password, hash);
		} catch (error) {
			// Log error but don't expose details
			console.error("Password verification error:", error.message);
			return false;
		}
	}
}
