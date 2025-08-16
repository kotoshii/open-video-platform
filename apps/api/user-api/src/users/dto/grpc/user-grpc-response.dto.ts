import { User } from "@ovp-proto/types/users";

import { GetUserDto } from "~src/users/dto/get-user.dto";

export class UserGrpcResponseDto implements User {
	constructor(user: GetUserDto) {
		const { id, email, dateOfBirth, createdDate, updatedDate } = user;

		this.id = id;
		this.email = email;
		this.dateOfBirth = dateOfBirth;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	id: string;

	email: string;

	dateOfBirth: Date | undefined;

	createdDate: Date | undefined;

	updatedDate: Date | undefined;
}
