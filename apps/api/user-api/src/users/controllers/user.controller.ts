import { Controller, Get, UnauthorizedException } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { NoChannel } from "@ovp-lib/api/auth/decorators/no-channel.decorator";
import { UserId } from "@ovp-lib/api/auth/decorators/user-id.decorator";

import { GetUserDto } from "~src/users/dto/get-user.dto";
import { UserService } from "~src/users/services/user.service";

@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@NoChannel()
	@ApiOkResponse({ type: GetUserDto })
	@Get("current")
	async getCurrentUser(@UserId() userId: string | null) {
		if (!userId) {
			throw new UnauthorizedException();
		}
		return this.userService.getCurrentUserByIdOrThrow(userId);
	}
}
