import { SagaCompensationError, SagaExecutionError } from "~utils/saga-pattern/exceptions";
import {
	ActionCallback,
	CompensateCallback,
	CompletedStep,
	ExecutionStep,
	SagaContext,
	SagaResult,
	SagaStatus,
	SagaStep,
} from "~utils/saga-pattern/types";
// todo add better logging, maybe optionally pass smth to saga factory or whatever, idk
export class Saga<TCurrentOutput = undefined, TPreviousResults extends Record<string, unknown> = {}> {
	private status: SagaStatus = "PENDING";

	private readonly steps: SagaStep[] = [];
	private results: TPreviousResults = {} as TPreviousResults;

	private readonly executionHistory: ExecutionStep[] = [];
	private readonly context: SagaContext<TPreviousResults>;

	constructor(transactionId: string, metadata: Record<string, unknown> = {}) {
		this.context = {
			results: this.results,
			transactionId,
			metadata,
		};
	}

	addStep<TStepName extends string, TStepOutput = unknown>(
		name: TStepName,
		action: ActionCallback<TCurrentOutput, TStepOutput, TPreviousResults>,
		compensate: CompensateCallback<TCurrentOutput, TStepOutput, TPreviousResults & { [K in TStepName]: TStepOutput }>,
	) {
		this.steps.push({
			name,
			action: action as ActionCallback,
			compensate: compensate as CompensateCallback,
		});

		return this as unknown as Saga<TStepOutput, TPreviousResults & { [K in TStepName]: TStepOutput }>;
	}

	async execute(initialInput?: TCurrentOutput): Promise<SagaResult<TPreviousResults>> {
		this.status = "RUNNING";

		const completedSteps: CompletedStep[] = [];

		try {
			let currentInput: unknown | undefined = initialInput;

			for (const step of this.steps) {
				try {
					const stepOutput = await step.action(currentInput, this.context);

					this.log("log", `Completed step: ${step.name}`);

					// Record successful execution
					this.executionHistory.push({
						stepName: step.name,
						input: currentInput,
						output: stepOutput,
						status: "SUCCESS",
						timestamp: new Date(),
					});

					// Store result for future steps
					this.results = { ...this.results, [step.name]: stepOutput };
					completedSteps.push({ step, input: currentInput, output: stepOutput });

					// Use step output as input for the next step (if needed)
					currentInput = stepOutput;
				} catch (error) {
					this.log("error", `Failed step: ${step.name}; ${error}`);

					// Record failed execution
					this.executionHistory.push({
						stepName: step.name,
						input: currentInput,
						status: "FAILED",
						timestamp: new Date(),
						error: error as Error,
					});

					throw new SagaExecutionError(
						`Step '${step.name}' failed: ${(error as Error).message}`,
						step.name,
						error as Error,
					);
				}
			}

			this.status = "COMPLETED";

			return {
				success: true,
				results: this.results,
			};
		} catch (error) {
			this.status = "FAILED";

			// Compensate completed steps
			const compensatedSteps = await this.compensate(completedSteps);

			return {
				success: false,
				error: error as Error,
				compensatedSteps,
			};
		}
	}

	private async compensate(completedSteps: CompletedStep[]): Promise<string[]> {
		this.status = "COMPENSATING";

		const compensatedSteps: string[] = [];
		const compensationErrors: Error[] = [];

		// Compensate in reverse order
		for (let i = completedSteps.length - 1; i >= 0; i--) {
			const { step, input, output } = completedSteps[i];

			try {
				await step.compensate(input, output, this.context);

				this.log("log", `Compensated step: ${step.name}`);

				// Record successful compensation
				this.executionHistory.push({
					stepName: step.name,
					input,
					output,
					status: "COMPENSATED",
					timestamp: new Date(),
				});

				compensatedSteps.push(step.name);
			} catch (error) {
				this.log("error", `Failed to compensate step: ${step.name}; ${error}`);

				compensationErrors.push(
					new SagaCompensationError(
						`Compensation failed for step '${step.name}': ${(error as Error).message}`,
						step.name,
						error as Error,
					),
				);
			}
		}

		this.status = "COMPENSATED";

		if (compensationErrors.length > 0) {
			console.warn(`Some compensations failed. Manual intervention may be required.`);
			// Log compensation errors but don't throw - we want to return what was compensated
			compensationErrors.forEach((err) => console.error(err.message));
		}

		console.log(`Compensation completed. Compensated steps: ${JSON.stringify(compensatedSteps)}`);
		return compensatedSteps;
	}

	/**
	 * Get current saga status
	 */
	getStatus(): SagaStatus {
		return this.status;
	}

	/**
	 * Get execution history
	 */
	getExecutionHistory(): ExecutionStep[] {
		return [...this.executionHistory];
	}

	/**
	 * Get step result
	 */
	getStepResult<TStepName extends string>(stepName: TStepName): TPreviousResults[TStepName] | undefined {
		return this.results[stepName];
	}

	private log(level: "log" | "warn" | "error", message: string) {
		console[level](
			`${new Date().toISOString()} ${level.toUpperCase()} [Saga: ${this.context.transactionId}] ${message}`,
		);
	}
}
