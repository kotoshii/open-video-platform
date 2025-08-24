import { Exclude } from "class-transformer";
import { Selectable } from "kysely";

import { RefreshToken } from "~db/schema";

export class GetRefreshTokenInfoDto {
	constructor(refreshTokenInfo: Selectable<RefreshToken>) {
		const { id, authSessionId, refreshTokenHash, active, expiresAt, createdDate, updatedDate, usedDate } =
			refreshTokenInfo;

		this.id = id;
		this.authSessionId = authSessionId;
		this.refreshTokenHash = refreshTokenHash;
		this.active = active;
		this.expiresAt = expiresAt;
		this.usedDate = usedDate;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	id: string;

	authSessionId: string;

	@Exclude()
	refreshTokenHash: string;

	active: boolean;

	expiresAt: Date;

	usedDate: Date | null;

	createdDate: Date;

	updatedDate: Date;

	@Exclude()
	get isExpired(): boolean {
		return this.expiresAt.getTime() <= Date.now();
	}

	@Exclude()
	get isUsed(): boolean {
		return this.usedDate !== null;
	}
}
