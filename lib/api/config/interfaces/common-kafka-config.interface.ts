export interface ICommonKafkaConfig {
	kafkaBrokers: string[];
	kafkaClientId?: string;
	kafkaGroupId?: string;
}
