import { Body, Controller, Headers, HttpStatus, Post, Res } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiNoContentResponse,
} from "@nestjs/swagger";
import { NoChannel } from "@ovp-lib/api/auth/decorators/no-channel.decorator";
import { Public } from "@ovp-lib/api/auth/decorators/public.decorator";
import { SessionId } from "@ovp-lib/api/auth/decorators/session-id.decorator";
import { NestErrorResponseDto } from "@ovp-lib/api/common/dto/nest-error-response.dto";
import type { Response } from "express";
import { RealIP } from "nestjs-real-ip";

import { CreateAccountDto } from "~src/auth/dto/create-account.dto";
import { AuthService } from "~src/auth/services/auth.service";
import { AuthSessionService } from "~src/auth-sessions/services/auth-session.service";
import { AuthTokensDto } from "~src/tokens/dto/auth-tokens.dto";

@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly authSessionService: AuthSessionService,
	) {}

	/*
	POST /auth/create-account
  POST /auth/login
  POST /auth/refresh
  POST /auth/logout
  */

	@Public()
	@ApiCreatedResponse({ type: AuthTokensDto })
	@ApiBadRequestResponse({ type: NestErrorResponseDto, description: "Params validation failed" })
	@ApiConflictResponse({ type: NestErrorResponseDto, description: "User with provided email already exists" })
	@ApiInternalServerErrorResponse({ type: NestErrorResponseDto })
	@Post("create-account")
	async createAccount(
		@Body() body: CreateAccountDto,
		@RealIP() ipAddress: string,
		@Headers("user-agent") userAgent: string,
	) {
		return this.authService.createAccountOrThrow(body, ipAddress, userAgent);
	}

	async login() {}

	async authenticateChannel() {}

	/* require authentication */

	async refresh() {}

	@NoChannel()
	@ApiNoContentResponse({ description: "Logout successful or user was already logged out" })
	@ApiInternalServerErrorResponse({ type: NestErrorResponseDto })
	@Post("logout")
	async logout(@Res() res: Response, @SessionId() sessionId: string) {
		await this.authSessionService.deleteAuthSessionById(sessionId);
		return res.sendStatus(HttpStatus.NO_CONTENT);
	}
}
