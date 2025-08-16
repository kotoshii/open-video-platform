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

	id: string;

	email: string;

	dateOfBirth: Date;

	createdDate: Date;

	updatedDate: Date;
}
