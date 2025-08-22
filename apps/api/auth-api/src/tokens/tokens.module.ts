import { Module } from "@nestjs/common";

import { TokenRepository } from "~src/tokens/repositories/token.repository";
import { TokenService } from "~src/tokens/services/token.service";

@Module({
	imports: [],
	exports: [TokenService],
	providers: [TokenRepository, TokenService],
})
export class TokensModule {}
