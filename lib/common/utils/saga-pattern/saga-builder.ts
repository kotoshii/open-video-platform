import { Saga } from "~utils/saga-pattern/saga";

export class SagaBuilder {
	static create<TInitialInput = unknown>(
		transactionId?: string | null,
		metadata?: Record<string, unknown>,
	): Saga<TInitialInput> {
		const id = transactionId || `saga-${Date.now()}-${crypto.randomUUID()}`;
		return new Saga<TInitialInput>(id, metadata);
	}
}
