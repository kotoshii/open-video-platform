import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { extractBearerTokenFromRequest } from "@ovp-lib/common/utils/tokens";
import { Request } from "express";

import { ALLOW_EXPIRED_KEY } from "~auth/decorators/allow-expired.decorator";
import { NO_CHANNEL_KEY } from "~auth/decorators/no-channel.decorator";
import { IS_PUBLIC_KEY } from "~auth/decorators/public.decorator";
import { AccessTokenPayload } from "~auth/types/access-token-payload";
import { ICommonJwtConfig } from "~config/interfaces/common-jwt-config.interface";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	private readonly logger = new Logger(JwtAuthGuard.name);

	constructor(
		private jwtService: JwtService,
		private jwtConfig: ICommonJwtConfig,
		private reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest<Request>();
		const token = extractBearerTokenFromRequest(request);

		if (!token) {
			this.logger.error("Authorization error: no token provided");
			throw new UnauthorizedException();
		}

		const allowExpired = this.reflector.getAllAndOverride<boolean>(ALLOW_EXPIRED_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
			secret: this.jwtConfig.jwtSecret,
			ignoreExpiration: allowExpired,
		});

		if (!payload.user_id || !payload.session_id) {
			this.logger.error("Authorization error: missing required JWT fields");
			throw new UnauthorizedException();
		}

		const noChannelRequired = this.reflector.getAllAndOverride<boolean>(NO_CHANNEL_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!noChannelRequired && !payload.channel_id) {
			this.logger.error("Authorization error: channel ID required for this endpoint");
			throw new UnauthorizedException();
		}

		request.userId = payload.user_id;
		request.channelId = payload.channel_id || null;
		request.sessionId = payload.session_id;

		return true;
	}
}
