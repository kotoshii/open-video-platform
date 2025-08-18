import { Payload } from "@nestjs/microservices";
import { GrpcController } from "@ovp-lib/api/common/decorators/grpc-controller.decorator";
import { CreateUserResponse, UserServiceController, UserServiceControllerMethods } from "@ovp-proto/types/users";

import { CreateUserDto } from "~src/users/dto/create-user.dto";
import { GetUserDto } from "~src/users/dto/get-user.dto";
import { CreateUserGrpcRequestDto } from "~src/users/dto/grpc/create-user-grpc-request.dto";
import { CreateUserGrpcResponseDto } from "~src/users/dto/grpc/create-user-grpc-response.dto";
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
}
