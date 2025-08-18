import { Payload } from "@nestjs/microservices";
import { GrpcController } from "@ovp-lib/api/common/decorators/grpc-controller.decorator";
import {
	CreateUserResponse,
	UserExistsResponse,
	UserServiceController,
	UserServiceControllerMethods,
} from "@ovp-proto/types/users";

import { CreateUserDto } from "~src/users/dto/create-user.dto";
import { GetUserDto } from "~src/users/dto/get-user.dto";
import { CreateUserGrpcRequestDto } from "~src/users/dto/grpc/create-user-grpc-request.dto";
import { CreateUserGrpcResponseDto } from "~src/users/dto/grpc/create-user-grpc-response.dto";
import { UserExistsGrpcRequestDto } from "~src/users/dto/grpc/user-exists-grpc-request.dto";
import { UserExistsGrpcResponseDto } from "~src/users/dto/grpc/user-exists-grpc-response.dto";
import { UserService } from "~src/users/services/user.service";

@GrpcController()
@UserServiceControllerMethods()
export class UserGrpcController implements UserServiceController {
	constructor(private readonly userService: UserService) {}

	async createUser(@Payload() body: CreateUserGrpcRequestDto): Promise<CreateUserResponse> {
		const dto = new CreateUserDto();

		dto.email = body.email;
		dto.dateOfBirth = body.dateOfBirth;
		dto.password = body.password;

		const user = await this.userService.createUserOrThrow(dto);
		return new CreateUserGrpcResponseDto(user);
	}

	async userExists(@Payload() body: UserExistsGrpcRequestDto): Promise<UserExistsResponse> {
		const { userId, email } = body;

		let user: GetUserDto | null = null;

		if (userId) {
			user = await this.userService.getUserById(userId);
		} else if (email) {
			user = await this.userService.getUserByEmail(email);
		}

		return new UserExistsGrpcResponseDto(Boolean(user));
	}
}
