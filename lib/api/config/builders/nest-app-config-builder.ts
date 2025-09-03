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

import { JwtAuthGuard } from "~auth/guards/jwt-auth.guard";
import { InternalServerErrorFilter } from "~common/filters/internal-server-error.filter";
import { CORS_CONFIG_INJECTION_TOKEN, JWT_CONFIG_INJECTION_TOKEN } from "~config/constants/injection-tokens";
import { ICommonCorsConfig } from "~config/interfaces/common-cors-config.interface";
import { HttpLoggingInterceptor } from "~logging/interceptors/http-logging.interceptor";

// copypasted from Nest type definitions
type IEntryNestModule = Type | DynamicModule | ForwardReference | Promise<IEntryNestModule>;

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

	constructor(private readonly app: INestApplication) {}

	setGlobalPrefix(prefix = "api") {
		this.app.setGlobalPrefix(prefix);
		return this;
	}

	addCors(corsDomainsConfigKey = "corsDomains") {
		const corsConfig = this.app.get<ICommonCorsConfig>(CORS_CONFIG_INJECTION_TOKEN);
		const corsDomains = corsConfig?.corsDomains;

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
	 * 1. Global routes prefix ("api" by default)
	 * 2. CORS config based on env variables
	 * 3. Global JWT auth guard.
	 * 4. Global validation pipe with the following options:
	 * `{ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }`
	 * 5. Global ClassSerializerInterceptor
	 * 6. Global LoggingInterceptor
	 * 7. Global exception filter: InternalServerErrorFilter.
	 *
	 * It **DOES NOT** include: Swagger, anything related to microservices.
	 * */
	addDefaults() {
		this.setGlobalPrefix();
		this.addCors();
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

	getProvider<T>(ProviderClass: Type<T>) {
		return this.app.get(ProviderClass);
	}
}
