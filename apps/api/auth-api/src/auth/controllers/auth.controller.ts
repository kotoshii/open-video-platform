import { Body, Controller, Headers, HttpStatus, Post, Res } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { NoChannel } from "@ovp-lib/api/auth/decorators/no-channel.decorator";
import { Public } from "@ovp-lib/api/auth/decorators/public.decorator";
import { SessionId } from "@ovp-lib/api/auth/decorators/session-id.decorator";
import { NestErrorResponseDto } from "@ovp-lib/api/common/dto/nest-error-response.dto";
import type { Response } from "express";
import { RealIP } from "nestjs-real-ip";

import { CreateAccountDto } from "~src/auth/dto/create-account.dto";
import { LoginDto } from "~src/auth/dto/login.dto";
import { AuthService } from "~src/auth/services/auth.service";
import { AuthSessionService } from "~src/auth-sessions/services/auth-session.service";
import { AuthTokensDto } from "~src/tokens/dto/auth-tokens.dto";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly authSessionService: AuthSessionService,
	) {}

	/*
  TODO: POST /auth/authenticate-channel
  TODO: POST /auth/refresh
  */

	@Public()
	@ApiCreatedResponse({ type: AuthTokensDto })
	@ApiBadRequestResponse({ type: NestErrorResponseDto, description: "Params validation failed" })
	@ApiConflictResponse({ type: NestErrorResponseDto, description: "User with provided email already exists" })
	@Post("create-account")
	async createAccount(
		@Body() body: CreateAccountDto,
		@RealIP() ipAddress: string,
		@Headers("user-agent") userAgent: string,
	) {
		return this.authService.createAccountOrThrow(body, ipAddress, userAgent);
	}

	@Public()
	@ApiOkResponse({ type: AuthTokensDto })
	@ApiUnauthorizedResponse({ type: NestErrorResponseDto, description: "Incorrect email or password" })
	@ApiBadRequestResponse({ type: NestErrorResponseDto, description: "Params validation failed" })
	@Post("login")
	async login(@Body() body: LoginDto, @RealIP() ipAddress: string, @Headers("user-agent") userAgent: string) {
		return this.authService.loginOrThrow(body, ipAddress, userAgent);
	}

	async authenticateChannel() {}

	async refresh() {}

	@NoChannel()
	@ApiNoContentResponse({ description: "Logout successful or user was already logged out" })
	@Post("logout")
	async logout(@Res() res: Response, @SessionId() sessionId: string) {
		await this.authSessionService.deleteAuthSessionById(sessionId);
		return res.sendStatus(HttpStatus.NO_CONTENT);
	}
}
