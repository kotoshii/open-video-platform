export interface ICommonKafkaConfig {
	kafkaBrokers: string[];
	kafkaSessionTimeout?: number;
	kafkaHeartbeatInterval?: number;
	kafkaClientId?: string;
	kafkaGroupId?: string;
	kafkaMinBytes?: number;
	kafkaMaxBytes?: number;
	kafkaMaxWaitTimeInMs?: number;
}
