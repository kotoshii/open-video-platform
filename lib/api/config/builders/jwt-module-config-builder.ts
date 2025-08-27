import { JwtModule } from "@nestjs/jwt";

import { JWT_CONFIG_INJECTION_TOKEN } from "~config/constants/injection-tokens";
import { ICommonJwtConfig } from "~config/interfaces/common-jwt-config.interface";

export class JwtModuleConfigBuilderFactory {
	static create() {
		return new JwtModuleConfigBuilder();
	}
}

class JwtModuleConfigBuilder {
	build() {
		return JwtModule.registerAsync({
			useFactory: (jwtConfig: ICommonJwtConfig) => ({
				global: true,
				secret: jwtConfig.jwtSecret,
				signOptions: { expiresIn: jwtConfig.jwtExpiresIn },
			}),
			inject: [JWT_CONFIG_INJECTION_TOKEN],
			global: true,
		});
	}
}
