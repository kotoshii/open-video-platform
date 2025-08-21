import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PasswordHasher } from "@ovp-lib/common/utils/password-hasher";
import { Insertable } from "kysely";

import { User } from "~db/schema";
import { CreateUserDto } from "~src/users/dto/create-user.dto";
import { GetUserDto } from "~src/users/dto/get-user.dto";
import { UserRepository } from "~src/users/repositories/user.repository";

@Injectable()
export class UserService {
	private readonly passwordHasher = new PasswordHasher();

	constructor(private readonly userRepository: UserRepository) {}

	async getUserById(userId: string) {
		const user = await this.userRepository.getUserById(userId);
		return user ? new GetUserDto(user) : null;
	}

	async getUserByEmail(email: string) {
		const user = await this.userRepository.getUserByEmail(email);
		return user ? new GetUserDto(user) : null;
	}

	async deleteUserById(userId: string) {
		const { id: deletedUserId } = await this.userRepository.deleteUserById(userId);
		return deletedUserId;
	}

	async getUserByIdOrThrow(userId: string) {
		const user = await this.userRepository.getUserById(userId);

		if (!user) {
			throw new NotFoundException("User not found");
		}

		return new GetUserDto(user);
	}

	async createUserOrThrow(dto: CreateUserDto) {
		const { email, dateOfBirth, password } = dto;

		const existing = await this.userRepository.getUserByEmail(email);
		if (existing) {
			throw new ConflictException("User with this email already exists");
		}

		const data: Insertable<User> = {
			email,
			dateOfBirth,
		};
		const passwordHash = await this.passwordHasher.hash(password);

		const userId = await this.userRepository.createUser(data, passwordHash);
		// todo remove extra db query

		return this.getUserByIdOrThrow(userId);
	}
}
