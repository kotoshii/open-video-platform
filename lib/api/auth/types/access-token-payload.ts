export interface AccessTokenPayload {
	user_id: string;
	channel_id?: string | null;
	session_id: string;
}
