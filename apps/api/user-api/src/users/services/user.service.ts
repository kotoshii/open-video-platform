import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Insertable } from "kysely";

import { User } from "~db/schema";
import { CreateUserDto } from "~src/users/dto/create-user.dto";
import { GetUserDto } from "~src/users/dto/get-user.dto";
import { UserAuthDetailsGrpcRequestDto } from "~src/users/dto/grpc/user-auth-details-grpc-request.dto";
import { UserAuthDetailsGrpcResponseDto } from "~src/users/dto/grpc/user-auth-details-grpc-response.dto";
import { UserRepository } from "~src/users/repositories/user.repository";

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async getUserById(userId: string) {
		const user = await this.userRepository.getUserById(userId);
		return user ? new GetUserDto(user) : null;
	}

	async getUserByEmail(email: string) {
		const user = await this.userRepository.getUserByEmail(email);
		return user ? new GetUserDto(user) : null;
	}

	async getPasswordHashByUserId(userId: string) {
		const passwordHash = await this.userRepository.getPasswordHashByUserId(userId);
		return passwordHash ? passwordHash.passwordHash : null;
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

	async getCurrentUserByIdOrThrow(userId: string) {
		const user = await this.userRepository.getUserById(userId);

		if (!user) {
			throw new UnauthorizedException();
		}

		return new GetUserDto(user);
	}

	async createUserOrThrow(dto: CreateUserDto) {
		const { email, dateOfBirth, passwordHash } = dto;

		const existing = await this.userRepository.getUserByEmail(email);
		if (existing) {
			throw new ConflictException("User with this email already exists");
		}

		const data: Insertable<User> = {
			email,
			dateOfBirth,
		};

		const userId = await this.userRepository.createUser(data, passwordHash);
		// todo remove extra db query

		return this.getUserByIdOrThrow(userId);
	}

	async validateAuthenticationDetails(body: UserAuthDetailsGrpcRequestDto): Promise<UserAuthDetailsGrpcResponseDto> {
		const { email, passwordHash } = body;

		const user = await this.getUserByEmail(email);

		if (user) {
			const userPasswordHash = await this.getPasswordHashByUserId(user.id);
			const valid = userPasswordHash === passwordHash;

			return new UserAuthDetailsGrpcResponseDto(valid, valid ? user.id : undefined);
		}

		return new UserAuthDetailsGrpcResponseDto(false);
	}
}
