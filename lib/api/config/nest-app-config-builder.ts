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
import { MicroserviceOptions } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { MaybeArray } from "@ovp-lib/common/types/maybe-array";
import { toArray } from "@ovp-lib/common/utils/arrays";
import { ClassConstructor } from "class-transformer";

import { InternalServerErrorFilter } from "~common/filters/internal-server-error.filter";
import { LoggingInterceptor } from "~common/interceptors/logging.interceptor";

// copypasted from Nest type definitions
type IEntryNestModule = Type | DynamicModule | ForwardReference | Promise<IEntryNestModule>;

// biome-ignore lint/suspicious/noExplicitAny: exact type is unknown, but `unknown` type is not allowed in `InstanceType`
type ConfigInstance = InstanceType<any>;

export class NestAppConfigBuilderFactory {
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

	addGlobalValidationPipe(options?: ValidationPipeOptions) {
		this.app.useGlobalPipes(new ValidationPipe(options));
		return this;
	}

	addGlobalClassSerializerInterceptor() {
		this.app.useGlobalInterceptors(new ClassSerializerInterceptor(this.app.get(Reflector)));
		return this;
	}

	addGlobalLoggingInterceptor() {
		this.app.useGlobalInterceptors(new LoggingInterceptor());
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
	 * 1. Global validation pipe with the following options:
	 * `{ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }`
	 * 2. Global interceptors: ClassSerializerInterceptor and LoggingInterceptor
	 * 3. Global exception filter: InternalServerErrorFilter
	 *
	 * It **DOES NOT** include: global prefix, CORS, Swagger, anything related to microservices.
	 * */
	addDefaults() {
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
		return instance?.[key] || null;
	}

	/* private methods for internal usage */

	private findFirstConfigInstanceWithKey(key: string) {
		return this.configInstances.find((instance) => typeof instance[key] !== "undefined") || null;
	}
}
