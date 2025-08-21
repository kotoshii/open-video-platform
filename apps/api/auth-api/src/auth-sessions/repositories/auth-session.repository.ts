import { Injectable } from "@nestjs/common";
import { Insertable, Kysely } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { AuthSession, DB } from "~db/schema";

@Injectable()
export class AuthSessionRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async createAuthSession(data: Insertable<AuthSession>) {
		return this.db.insertInto("authSessions").values(data).returningAll().executeTakeFirstOrThrow();
	}
}
