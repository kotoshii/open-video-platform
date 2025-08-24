import { Selectable } from "kysely";

import { AuthSession } from "~db/schema";

export class GetAuthSessionDto {
	constructor(authSession: Selectable<AuthSession>) {
		const { id, userId, channelId, countryCode, ipAddress, userAgent, expiresAt, createdDate, updatedDate } =
			authSession;

		this.id = id;
		this.userId = userId;
		this.channelId = channelId;
		this.countryCode = countryCode;
		this.ipAddress = ipAddress;
		this.userAgent = userAgent;
		this.expiresAt = expiresAt;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	id: string;

	userId: string;

	channelId: string | null;

	countryCode: string | null;

	ipAddress: string | null;

	userAgent: string | null;

	expiresAt: Date;

	createdDate: Date;

	updatedDate: Date;
}
