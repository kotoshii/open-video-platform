import {
	ClassSerializerInterceptor,
	DynamicModule,
	ForwardReference,
	INestApplication,
	Logger,
	Type,
	ValidationPipe,
	ValidationPipeOptions,
} from "@nestjs/common";
import { NestApplicationOptions } from "@nestjs/common/interfaces/nest-application-options.interface";
import { NestFactory, Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { MicroserviceOptions } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { MaybeArray } from "@ovp-lib/common/types/maybe-array";
import { toArray } from "@ovp-lib/common/utils/arrays";
import { ClassConstructor } from "class-transformer";

import { JwtAuthGuard } from "~auth/guards/jwt-auth.guard";
import { InternalServerErrorFilter } from "~common/filters/internal-server-error.filter";
import { JWT_CONFIG_INJECTION_TOKEN } from "~config/constants/injection-tokens";
import { HttpLoggingInterceptor } from "~logging/interceptors/http-logging.interceptor";

// copypasted from Nest type definitions
type IEntryNestModule = Type | DynamicModule | ForwardReference | Promise<IEntryNestModule>;

// biome-ignore lint/suspicious/noExplicitAny: exact type is unknown, but `unknown` type is not allowed in `InstanceType`
type ConfigInstance = InstanceType<any>;

export class NestAppConfigBuilderFactory {
	// to make it not callable with `new` keyword
	private constructor() {}

	static async create(module: IEntryNestModule, options?: NestApplicationOptions) {
		const app = await NestFactory.create(module, options);
		return new NestAppConfigBuilder(app);
	}
}

class NestAppConfigBuilder {
	private readonly logger = new Logger(NestAppConfigBuilder.name);

	private readonly configInstances: ConfigInstance[] = [];

	constructor(private readonly app: INestApplication) {}

	/* methods directly related to "building" process; start with "add", e.g. addLoggingInterceptor() */

	setGlobalPrefix(prefix = "api") {
		this.app.setGlobalPrefix(prefix);
		return this;
	}

	addCors(corsDomainsConfigKey = "corsDomains") {
		const corsDomains = this.lookupConfigValue<string[] | "*">(corsDomainsConfigKey);

		if (!corsDomains) {
			this.logger.warn(`Could not add CORS config: ${corsDomainsConfigKey} config value not found`);
			return this;
		}

		this.app.enableCors({ origin: corsDomains });

		return this;
	}

	addGlobalJwtAuthGuard() {
		const jwtService = this.app.get(JwtService);
		const jwtConfig = this.app.get(JWT_CONFIG_INJECTION_TOKEN);
		const reflector = this.app.get(Reflector);

		this.app.useGlobalGuards(new JwtAuthGuard(jwtService, jwtConfig, reflector));
	}

	addGlobalValidationPipe(options?: ValidationPipeOptions) {
		this.app.useGlobalPipes(new ValidationPipe(options));
		return this;
	}

	addGlobalClassSerializerInterceptor() {
		this.app.useGlobalInterceptors(new ClassSerializerInterceptor(this.app.get(Reflector)));
		return this;
	}

	addGlobalLoggingInterceptor() {
		this.app.useGlobalInterceptors(new HttpLoggingInterceptor());
		return this;
	}

	addGlobalInternalServerErrorExceptionFilter() {
		this.app.useGlobalFilters(new InternalServerErrorFilter());
		return this;
	}

	addSwagger(title: string, version = "1.0", path = "docs/api") {
		const swaggerConfig = new DocumentBuilder().setTitle(title).setVersion(version).addBearerAuth().build();
		const document = SwaggerModule.createDocument(this.app, swaggerConfig);

		SwaggerModule.setup(path, this.app, document, {
			swaggerOptions: {
				tagsSorter: "alpha",
				operationsSorter: "method",
			},
		});

		return this;
	}

	addMicroservice(options: MicroserviceOptions) {
		this.app.connectMicroservice<MicroserviceOptions>(options);
		return this;
	}

	/**
	 * Default config includes
	 * 1. Global JWT auth guard.
	 * 2. Global validation pipe with the following options:
	 * `{ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }`
	 * 3. Global interceptors: ClassSerializerInterceptor and LoggingInterceptor.
	 * 4. Global exception filter: InternalServerErrorFilter.
	 *
	 * It **DOES NOT** include: global prefix, CORS, Swagger, anything related to microservices.
	 * */
	addDefaults() {
		this.addGlobalJwtAuthGuard();
		this.addGlobalValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
		});
		this.addGlobalClassSerializerInterceptor();
		this.addGlobalLoggingInterceptor();
		this.addGlobalInternalServerErrorExceptionFilter();

		return this;
	}

	build() {
		return this.app;
	}

	/* public methods that are not related to "building" process itself */

	provideConfig<T extends ClassConstructor<ConfigInstance>>(configInstanceClass: MaybeArray<T>) {
		const instances = toArray(configInstanceClass)
			.map((cls) => this.app.get(cls))
			.filter(Boolean);
		this.configInstances.push(...instances);

		return this;
	}

	lookupConfigValue<R = unknown>(key: string): R | null {
		const instance = this.findFirstConfigInstanceWithKey(key);
		const value = instance?.[key] || null;

		if (!value) {
			this.logger.warn(`Could not find config value: ${key}`);
		}

		return value;
	}

	/* private methods for internal usage */

	private findFirstConfigInstanceWithKey(key: string) {
		return this.configInstances.find((instance) => typeof instance[key] !== "undefined") || null;
	}
}
