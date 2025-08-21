export interface SagaContext<TPreviousResults extends Record<string, unknown>> {
	results: TPreviousResults;
	transactionId?: string | null;
	metadata?: Record<string, unknown>;
}

export type ActionCallback<
	TInput = unknown,
	TOutput = unknown,
	TPreviousResults extends Record<string, unknown> = {},
> = (input: TInput, context: SagaContext<TPreviousResults>) => Promise<TOutput>;

export type CompensateCallback<
	TInput = unknown,
	TOutput = unknown,
	TPreviousResults extends Record<string, unknown> = {},
> = (input: TInput, output: TOutput, context: SagaContext<TPreviousResults>) => Promise<void>;

export interface SagaStep<TInput = unknown, TOutput = unknown> {
	name: string;
	action: ActionCallback<TInput, TOutput>;
	compensate: CompensateCallback<TInput, TOutput>;
}

export interface SagaResult<TPreviousResults extends Record<string, unknown> = {}> {
	success: boolean;
	results?: TPreviousResults;
	error?: Error;
	compensatedSteps?: string[];
}

export type SagaStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "COMPENSATING" | "COMPENSATED";

export type ExecutionStepStatus = "SUCCESS" | "FAILED" | "COMPENSATED";

export interface ExecutionStep {
	stepName: string;
	input: unknown;
	output?: unknown;
	status: ExecutionStepStatus;
	timestamp: Date;
	error?: Error;
}

export interface CompletedStep {
	step: SagaStep;
	input: unknown;
	output: unknown;
}
