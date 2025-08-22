declare namespace Express {
	interface Request {
		userId: string | null;
		channelId: string | null;
		sessionId: string | null;
	}
}
