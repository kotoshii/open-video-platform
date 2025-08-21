import { Injectable } from "@nestjs/common";
import { StringHasher } from "@ovp-lib/common/utils/string-hasher";

@Injectable()
export class PasswordService {
	private readonly stringHasher = new StringHasher();

	async hashPassword(password: string) {
		return this.stringHasher.hash(password);
	}

	async verifyPassword(password: string, hash: string) {
		return this.stringHasher.verify(password, hash);
	}
}
