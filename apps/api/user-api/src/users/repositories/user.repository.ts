import { Injectable } from "@nestjs/common";
import { Insertable, Kysely } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { DB, User } from "~db/schema";

@Injectable()
export class UserRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async getUserById(userId: string) {
		return this.userQuery.where("id", "=", userId).executeTakeFirst();
	}

	async getUserByEmail(email: string) {
		return this.userQuery.where("email", "=", email).executeTakeFirst();
	}

	async createUser(data: Insertable<User>, passwordHash: string) {
		return this.db.transaction().execute(async (trx) => {
			const { id: userId } = await trx.insertInto("users").values(data).returning("id").executeTakeFirstOrThrow();
			await trx.insertInto("userPasswords").values({ userId, passwordHash }).executeTakeFirstOrThrow();

			return userId;
		});
	}

	async deleteUserById(userId: string) {
		return this.db.deleteFrom("users").where("id", "=", userId).returning("id").executeTakeFirstOrThrow();
	}

	private get userQuery() {
		return this.db
			.selectFrom("users")
			.select("id")
			.select("email")
			.select("dateOfBirth")
			.select("createdDate")
			.select("updatedDate");
	}
}
