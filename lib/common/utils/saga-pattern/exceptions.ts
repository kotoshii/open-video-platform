export class SagaError extends Error {
	constructor(
		message: string,
		public readonly stepName: string,
		public readonly originalError?: Error,
	) {
		super(message);
	}
}

export class SagaExecutionError extends SagaError {
	constructor(
		message: string,
		public readonly stepName: string,
		public readonly originalError?: Error,
	) {
		super(message, stepName, originalError);
		this.name = "SagaExecutionError";
	}
}

export class SagaCompensationError extends SagaError {
	constructor(
		message: string,
		public readonly stepName: string,
		public readonly originalError?: Error,
	) {
		super(message, stepName, originalError);
		this.name = "SagaCompensationError";
	}
}
