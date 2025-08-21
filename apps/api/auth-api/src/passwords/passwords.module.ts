import { Module } from "@nestjs/common";

import { PasswordService } from "~src/passwords/services/password.service";

@Module({
	imports: [],
	exports: [PasswordService],
	providers: [PasswordService],
})
export class PasswordsModule {}
