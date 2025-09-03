import {
	ClassSerializerInterceptor,
	DynamicModule,
	ForwardReference,
	INestApplicationContext,
	INestMicroservice,
	Type,
	ValidationPipe,
	ValidationPipeOptions,
} from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";

// copypasted from Nest type definitions
type IEntryNestModule = Type | DynamicModule | ForwardReference | Promise<IEntryNestModule>;

type BuilderState = "initial" | "withApp";

type BuildMethodReturnType<TState extends BuilderState> = TState extends "initial" ? null : INestMicroservice;

/**
 * Base builder interface before microservice is created.
 */
interface NestMicroserviceAppConfigBuilderInitial {
	getProvider<T>(ProviderClass: Type<T>): T;
	createMicroservice(options: MicroserviceOptions): Promise<NestMicroserviceAppConfigBuilderWithApp>;
	build(): null;
}

/**
 * Builder interface after microservice is created.
 */
interface NestMicroserviceAppConfigBuilderWithApp extends Omit<NestMicroserviceAppConfigBuilderInitial, "build"> {
	addGlobalValidationPipe(options?: ValidationPipeOptions): this;
	addGlobalClassSerializerInterceptor(): this;
	addDefaults(): this;

	build(): INestMicroservice;
}

export class NestMicroserviceAppConfigBuilderFactory {
	// to make it not callable with `new` keyword
	private constructor() {}

	static async create(module: IEntryNestModule) {
		return NestMicroserviceAppConfigBuilder.create(module);
	}
}

class NestMicroserviceAppConfigBuilder<TState extends BuilderState> {
	private app: INestMicroservice | null = null;

	private constructor(
		private readonly AppModuleClass: IEntryNestModule,
		private readonly appContext: INestApplicationContext,
	) {}

	static async create(AppModuleClass: IEntryNestModule) {
		const appContext = await NestFactory.createApplicationContext(AppModuleClass);
		return new NestMicroserviceAppConfigBuilder<"initial">(
			AppModuleClass,
			appContext,
		) as NestMicroserviceAppConfigBuilderInitial;
	}

	addGlobalValidationPipe(options?: ValidationPipeOptions) {
		this.app?.useGlobalPipes(new ValidationPipe(options));
		return this;
	}

	addGlobalClassSerializerInterceptor() {
		this.app?.useGlobalInterceptors(new ClassSerializerInterceptor(this.app.get(Reflector)));
		return this;
	}

	/**
	 * Default config includes
	 * 1. Global validation pipe with the following options:
	 * `{ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }`
	 * 2. Global ClassSerializerInterceptor
	 * */
	addDefaults() {
		this.addGlobalValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
		});
		this.addGlobalClassSerializerInterceptor();

		return this;
	}

	async createMicroservice(options: MicroserviceOptions) {
		this.app = await NestFactory.createMicroservice<MicroserviceOptions>(this.AppModuleClass, options);
		return this as NestMicroserviceAppConfigBuilderWithApp;
	}

	build(): BuildMethodReturnType<TState> {
		return (this.app ?? null) as BuildMethodReturnType<TState>;
	}

	getProvider<T>(ProviderClass: Type<T>) {
		return this.appContext.get(ProviderClass);
	}
}
