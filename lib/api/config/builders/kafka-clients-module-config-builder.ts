import { Type } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

interface KafkaClientConfig<TKafkaConfig> {
	name: string;
	clientIdKey: keyof TKafkaConfig;
	brokersKey: keyof TKafkaConfig;
}

export class KafkaClientsModuleConfigBuilderFactory {
	static create<TKafkaConfig>(KafkaConfigClass: Type<TKafkaConfig>) {
		return new KafkaClientsModuleConfigBuilder(KafkaConfigClass);
	}
}

class KafkaClientsModuleConfigBuilder<TKafkaConfig> {
	private readonly clientConfigs: KafkaClientConfig<TKafkaConfig>[] = [];

	constructor(private readonly KafkaConfigClass: Type<TKafkaConfig>) {}

	addClient(name: string, clientIdKey: keyof TKafkaConfig, brokersKey: keyof TKafkaConfig) {
		this.clientConfigs.push({ name, clientIdKey, brokersKey });
		return this;
	}

	build() {
		return ClientsModule.registerAsync(
			this.clientConfigs.map((config) => ({
				name: config.name,
				useFactory: (kafkaConfig: TKafkaConfig) => ({
					transport: Transport.KAFKA,
					options: {
						client: {
							clientId: kafkaConfig[config.clientIdKey] as string,
							brokers: kafkaConfig[config.brokersKey] as string[],
						},
					},
				}),
				inject: [this.KafkaConfigClass],
			})),
		);
	}
}
