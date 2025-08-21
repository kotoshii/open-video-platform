import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { JwtConfig } from "~src/config/providers/jwt.config";
import { TokenRepository } from "~src/tokens/repositories/token.repository";
import { TokenService } from "~src/tokens/services/token.service";

@Module({
	imports: [
		JwtModule.registerAsync({
			inject: [JwtConfig],
			useFactory: (jwtConfig: JwtConfig) => ({
				secret: jwtConfig.jwtSecret,
				signOptions: { expiresIn: jwtConfig.jwtExpiresIn },
			}),
		}),
	],
	exports: [TokenService],
	providers: [TokenRepository, TokenService],
})
export class TokensModule {}
