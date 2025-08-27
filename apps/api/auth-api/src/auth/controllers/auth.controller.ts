import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AllowExpired } from "@ovp-lib/api/auth/decorators/allow-expired.decorator";
import { ChannelId } from "@ovp-lib/api/auth/decorators/channel-id.decorator";
import { NoChannel } from "@ovp-lib/api/auth/decorators/no-channel.decorator";
import { Public } from "@ovp-lib/api/auth/decorators/public.decorator";
import { SessionId } from "@ovp-lib/api/auth/decorators/session-id.decorator";
import { UserId } from "@ovp-lib/api/auth/decorators/user-id.decorator";
import { NestErrorResponseDto } from "@ovp-lib/api/common/dto/nest-error-response.dto";
import type { Response } from "express";
import { RealIP } from "nestjs-real-ip";

import { AuthenticateChannelDto } from "~src/auth/dto/authenticate-channel.dto";
import { CreateAccountDto } from "~src/auth/dto/create-account.dto";
import { LoginDto } from "~src/auth/dto/login.dto";
import { RefreshTokensRequestDto } from "~src/auth/dto/refresh-tokens-request.dto";
import { AuthService } from "~src/auth/services/auth.service";
import { AuthSessionService } from "~src/auth-sessions/services/auth-session.service";
import { AccessTokenDto } from "~src/tokens/dto/access-token.dto";
import { AuthTokensDto } from "~src/tokens/dto/auth-tokens.dto";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly authSessionService: AuthSessionService,
	) {}

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

	@NoChannel()
	@ApiOkResponse({ type: AccessTokenDto })
	@ApiUnauthorizedResponse({
		type: NestErrorResponseDto,
		description: "Channel not found or current user does not have access to it",
	})
	@ApiBadRequestResponse({ type: NestErrorResponseDto, description: "Params validation failed" })
	@Post("authenticate-channel")
	async authenticateChannel(
		@UserId() userId: string,
		@SessionId() sessionId: string,
		@Body() body: AuthenticateChannelDto,
	) {
		return this.authService.authenticateChannelOrThrow(userId, sessionId, body);
	}

	@NoChannel()
	@AllowExpired()
	@ApiOkResponse({ type: AuthTokensDto })
	@ApiUnauthorizedResponse({
		type: NestErrorResponseDto,
		description: "Refresh token is invalid or expired",
	})
	@ApiBadRequestResponse({ type: NestErrorResponseDto, description: "Params validation failed" })
	@Post("refresh")
	async refresh(
		@UserId() userId: string,
		@ChannelId() channelId: string | null,
		@SessionId() sessionId: string,
		@Body() body: RefreshTokensRequestDto,
	) {
		return this.authService.refreshTokens(userId, channelId, sessionId, body);
	}

	@HttpCode(HttpStatus.OK)
	@NoChannel()
	@ApiNoContentResponse({ description: "Logout successful or user was already logged out" })
	@Post("logout")
	async logout(@Res() res: Response, @SessionId() sessionId: string) {
		await this.authSessionService.deleteAuthSessionById(sessionId);
		return res.sendStatus(HttpStatus.NO_CONTENT);
	}
}
