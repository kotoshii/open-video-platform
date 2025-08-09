import { Module } from "@nestjs/common";

import { UserController } from "~src/users/controllers/user.controller";
import { UserRepository } from "~src/users/repositories/user.repository";
import { UserService } from "~src/users/services/user.service";

@Module({
	imports: [],
	controllers: [UserController],
	providers: [UserService, UserRepository],
})
export class UsersModule {}
