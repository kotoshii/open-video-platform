import { Injectable } from "@nestjs/common";
import { Insertable, Kysely, Updateable } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { AuthSession, DB } from "~db/schema";

@Injectable()
export class AuthSessionRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async createAuthSession(data: Insertable<AuthSession>) {
		return this.db.insertInto("authSessions").values(data).returningAll().executeTakeFirstOrThrow();
	}

	async updateAuthSession(sessionId: string, data: Updateable<AuthSession>) {
		return this.db
			.updateTable("authSessions")
			.set(data)
			.where("id", "=", sessionId)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	async deleteAuthSessionById(sessionId: string) {
		return this.db.deleteFrom("authSessions").where("id", "=", sessionId).executeTakeFirstOrThrow();
	}

	private get authSessionQuery() {
		return this.db
			.selectFrom("authSessions")
			.select("id")
			.select("userId")
			.select("channelId")
			.select("countryCode")
			.select("countryName")
			.select("cityName")
			.select("ipAddress")
			.select("userAgent")
			.select("expiresAt")
			.select("createdDate")
			.select("updatedDate");
	}
}
