import { Request } from "express";

export function extractBearerTokenFromRequest(request: Request): string | null {
	const [type, token] = request.headers.authorization?.split(" ") ?? [];
	return type === "Bearer" ? token || null : null;
}
