export interface BaseKafkaEventPayload {
	eventId: string;
	type: string;
	timestamp: number; // use Date.now();
}
