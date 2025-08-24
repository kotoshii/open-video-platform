import { Injectable } from "@nestjs/common";
import { Insertable, Kysely, Updateable } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { DB, RefreshToken } from "~db/schema";

@Injectable()
export class TokenRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async getRefreshTokenByHash(hash: string) {
		return this.refreshTokenQuery.where("refreshTokenHash", "=", hash).executeTakeFirst();
	}

	async createRefreshToken(data: Insertable<RefreshToken>) {
		return this.db.insertInto("refreshTokens").values(data).returningAll().executeTakeFirstOrThrow();
	}

	async updateRefreshTokenById(tokenId: string, data: Updateable<RefreshToken>) {
		return this.db
			.updateTable("refreshTokens")
			.set(data)
			.where("id", "=", tokenId)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	private get refreshTokenQuery() {
		return this.db
			.selectFrom("refreshTokens")
			.select("id")
			.select("authSessionId")
			.select("refreshTokenHash")
			.select("active")
			.select("expiresAt")
			.select("usedDate")
			.select("createdDate")
			.select("updatedDate");
	}
}
