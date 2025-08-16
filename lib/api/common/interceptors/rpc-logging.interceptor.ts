import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { catchError, Observable, tap } from "rxjs";

@Injectable()
export class RpcLoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger(RpcLoggingInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const host = context.switchToRpc();
		const args = context.getArgs();

		const body = host.getData();
		const metadata = host.getContext();

		const serverStream = args.at(2);
		const handlerClassName = context.getClass().name;
		const handlerName = context.getHandler().name;

		const servicePath = serverStream?.path as string | undefined;
		const handlerPath = `${handlerClassName}.${handlerName}`;

		const requestLog = [
			"[RpcRequest]",
			servicePath,
			`(${handlerPath})`,
			`Body: ${JSON.stringify(body)};`,
			`Metadata: ${JSON.stringify(metadata)}`,
		]
			.filter(Boolean)
			.join(" ");

		this.logger.verbose(requestLog);

		return next.handle().pipe(
			tap((data) => {
				const responseLog = ["[RpcResponse]", servicePath, `(${handlerPath})`, `Data: ${JSON.stringify(data)}`]
					.filter(Boolean)
					.join(" ");

				this.logger.verbose(responseLog);
			}),
			catchError((error) => {
				const errorLog = ["[RpcError]", servicePath, `(${handlerPath})`, `Error: ${error.message};`, error.stack]
					.filter(Boolean)
					.join(" ");
				this.logger.error(errorLog);

				throw error;
			}),
		);
	}
}
