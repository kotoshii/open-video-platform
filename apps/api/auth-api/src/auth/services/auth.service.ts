import { Inject, Injectable, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { IpGeoLocator } from "@ovp-lib/common/utils/ip-geo-locator";
import { SagaBuilder } from "@ovp-lib/common/utils/saga-pattern/saga-builder";
import { CHANNEL_SERVICE_NAME, CHANNELS_PACKAGE_NAME, ChannelServiceClient } from "@ovp-proto/types/channels";
import { USER_SERVICE_NAME, USERS_PACKAGE_NAME, UserServiceClient } from "@ovp-proto/types/users";

import { AuthenticateChannelDto } from "~src/auth/dto/authenticate-channel.dto";
import { CreateAccountDto } from "~src/auth/dto/create-account.dto";
import { LoginDto } from "~src/auth/dto/login.dto";
import { AuthSessionService } from "~src/auth-sessions/services/auth-session.service";
import { PasswordService } from "~src/passwords/services/password.service";
import { AccessTokenDto } from "~src/tokens/dto/access-token.dto";
import { AuthTokensDto } from "~src/tokens/dto/auth-tokens.dto";
import { TokenService } from "~src/tokens/services/token.service";

@Injectable()
export class AuthService implements OnModuleInit {
	private readonly ipGeoLocator: IpGeoLocator = new IpGeoLocator();

	private userGrpcService: UserServiceClient;
	private channelGrpcService: ChannelServiceClient;

	constructor(
		@Inject(USERS_PACKAGE_NAME) private userClientGrpc: ClientGrpc,
		@Inject(CHANNELS_PACKAGE_NAME) private channelClientGrpc: ClientGrpc,
		private readonly passwordService: PasswordService,
		private readonly authSessionService: AuthSessionService,
		private readonly tokenService: TokenService,
	) {}

	onModuleInit() {
		this.userGrpcService = this.userClientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
		this.channelGrpcService = this.channelClientGrpc.getService<ChannelServiceClient>(CHANNEL_SERVICE_NAME);
	}

	async createAccountOrThrow(dto: CreateAccountDto, ipAddress: string | null = null, userAgent: string | null = null) {
		const sagaResults = await this.createAccountSaga(dto);

		if (sagaResults.error) {
			throw sagaResults.error;
		}

		const userId = sagaResults.results?.createUser?.user?.id || null;
		const channelId = sagaResults.results?.createChannel?.channel?.id || null;

		if (!userId || !channelId) {
			throw new Error(`Failed to create account: userId ${userId}, channelId ${channelId}`);
		}

		const { countryCode, countryName, cityName } = await this.ipGeoLocator.lookup(ipAddress);

		const authSession = await this.authSessionService.createAuthSession(
			userId,
			channelId,
			countryCode,
			countryName,
			cityName,
			ipAddress,
			userAgent,
		);
		const refreshToken = await this.tokenService.issueNewRefreshToken(authSession.id);
		const accessToken = await this.tokenService.issueNewAccessToken({
			user_id: userId,
			channel_id: channelId,
			session_id: authSession.id,
		});

		return new AuthTokensDto(accessToken, refreshToken);
	}

	async loginOrThrow(dto: LoginDto, ipAddress: string | null = null, userAgent: string | null = null) {
		const { email, password } = dto;

		const passwordHash = await this.passwordService.hashPassword(password);

		const authDetailsValidationResponse = await this.userGrpcService
			.validateAuthenticationDetails({ email, passwordHash })
			.toPromise();

		const valid = authDetailsValidationResponse?.valid || false;
		const userId = authDetailsValidationResponse?.userId || null;

		if (!valid || !userId) {
			throw new UnauthorizedException("Incorrect email or password");
		}

		const { countryCode, countryName, cityName } = await this.ipGeoLocator.lookup(ipAddress);

		const authSession = await this.authSessionService.createAuthSession(
			userId,
			null,
			countryCode,
			countryName,
			cityName,
			ipAddress,
			userAgent,
		);
		const refreshToken = await this.tokenService.issueNewRefreshToken(authSession.id);
		const accessToken = await this.tokenService.issueNewAccessToken({
			user_id: userId,
			session_id: authSession.id,
		});

		return new AuthTokensDto(accessToken, refreshToken);
	}

	async authenticateChannelOrThrow(userId: string, sessionId: string, dto: AuthenticateChannelDto) {
		const { channelId } = dto;

		const authDetailsValidationResponse = await this.channelGrpcService
			.validateAuthenticationDetails({ userId, channelId })
			.toPromise();

		const valid = authDetailsValidationResponse?.valid || false;

		if (!valid) {
			throw new UnauthorizedException("Unable to authenticate selected channel");
		}

		await this.authSessionService.setChannelId(sessionId, channelId);
		await this.authSessionService.resetSessionExpiration(sessionId);

		const accessToken = await this.tokenService.issueNewAccessToken({
			user_id: userId,
			channel_id: channelId,
			session_id: sessionId,
		});

		return new AccessTokenDto(accessToken);
	}

	private async createAccountSaga(dto: CreateAccountDto) {
		const { email, dateOfBirth, password, channelName } = dto;

		const transactionId = `create-account-transaction-${new Date()}-${Buffer.from(email).toString("base64")}}`;
		const saga = SagaBuilder.create(transactionId);

		return saga
			.addStep(
				"createUser",
				async () => {
					const passwordHash = await this.passwordService.hashPassword(password);

					return this.userGrpcService.createUser({ email, dateOfBirth, passwordHash }).toPromise();
				},
				async (_, output) => {
					const userId = output?.user?.id;
					if (!userId) {
						throw new Error('Could not compensate "createUser": userId is empty');
					}

					await this.userGrpcService.deleteUser({ userId }).toPromise();
				},
			)
			.addStep(
				"createChannel",
				async (input) => {
					const userId = input?.user?.id;
					if (!userId) {
						throw new Error('Could not run "createChannel": userId is empty');
					}

					return this.channelGrpcService.createChannel({ userId, name: channelName }).toPromise();
				},
				async (_, output) => {
					const channelId = output?.channel?.id;
					if (!channelId) {
						throw new Error('Could not compensate "createChannel": channelId is empty');
					}

					await this.channelGrpcService.deleteChannel({ channelId }).toPromise();
				},
			)
			.execute();
	}
}
