import { Module } from "@nestjs/common";

import { AuthSessionRepository } from "~src/auth-sessions/repositories/auth-session.repository";
import { AuthSessionService } from "~src/auth-sessions/services/auth-session.service";

@Module({
	imports: [],
	exports: [AuthSessionService],
	providers: [AuthSessionRepository, AuthSessionService],
})
export class AuthSessionsModule {}
