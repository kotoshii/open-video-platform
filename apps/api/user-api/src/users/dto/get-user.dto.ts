import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Selectable } from "kysely";

import { User } from "~db/schema";

export class GetUserDto {
	constructor(user: Selectable<User>) {
		const { id, email, dateOfBirth, createdDate, updatedDate } = user;

		this.id = id;
		this.email = email;
		this.dateOfBirth = dateOfBirth;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	@ApiProperty()
	id: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	dateOfBirth: Date;

	@Exclude()
	createdDate: Date;

	@Exclude()
	updatedDate: Date;
}
