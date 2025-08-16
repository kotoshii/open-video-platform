import { Payload } from "@nestjs/microservices";
import { GrpcController } from "@ovp-lib/api/common/decorators/grpc-controller.decorator";
import { CreateUserResponse, UserServiceController, UserServiceControllerMethods } from "@ovp-proto/types/users";

import { CreateUserDto } from "~src/users/dto/create-user.dto";
import { CreateUserGrpcResponseDto } from "~src/users/dto/grpc/create-user-grpc-response.dto";
import { UserService } from "~src/users/services/user.service";

@GrpcController()
@UserServiceControllerMethods()
export class UserGrpcController implements UserServiceController {
	constructor(private readonly userService: UserService) {}

	async createUser(@Payload() body: CreateUserDto): Promise<CreateUserResponse> {
		const user = await this.userService.createUserOrThrow(body);
		return new CreateUserGrpcResponseDto(user);
	}
}
