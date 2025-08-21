import { Body, Controller, Headers, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { NestErrorResponseDto } from "@ovp-lib/api/common/dto/nest-error-response.dto";
import { RealIP } from "nestjs-real-ip";

import { CreateAccountDto } from "~src/auth/dto/create-account.dto";
import { AuthService } from "~src/auth/services/auth.service";

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/*
	POST /auth/create-account
  POST /auth/login
  POST /auth/refresh
  POST /auth/logout
  */

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

	/* require authentication */

	async refresh() {}

	async logout() {}
}
