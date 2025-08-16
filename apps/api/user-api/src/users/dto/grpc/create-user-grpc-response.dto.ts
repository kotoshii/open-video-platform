import { CreateUserResponse } from "@ovp-proto/types/users";

import { GetUserDto } from "~src/users/dto/get-user.dto";
import { UserGrpcResponseDto } from "~src/users/dto/grpc/user-grpc-response.dto";

export class CreateUserGrpcResponseDto implements CreateUserResponse {
	constructor(user: GetUserDto) {
		this.user = new UserGrpcResponseDto(user);
	}

	user: UserGrpcResponseDto;
}
