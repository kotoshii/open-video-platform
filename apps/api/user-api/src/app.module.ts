import { Module } from "@nestjs/common";

import { ConfigModule } from "~src/config/config.module";
import { UsersModule } from "~src/users/users.module";

@Module({
	imports: [ConfigModule, UsersModule],
})
export class AppModule {}
