import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { catchError, Observable, tap } from "rxjs";

import { maskSensitiveData } from "~common/utils/logging";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger(LoggingInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const req = context.switchToHttp().getRequest();
		const { method, url, body, query, params } = req;

		this.logger.verbose(
			`[Request] [${method}] ${url}  Params: ${JSON.stringify(params)} - Query: ${JSON.stringify(query)} - Body: ${JSON.stringify(maskSensitiveData(body))}`,
		);

		return next.handle().pipe(
			tap((data) => {
				this.logger.verbose(`[Response] [${method}] ${url} : ${JSON.stringify(maskSensitiveData(data))}`);
			}),
			catchError((err) => {
				this.logger.error(`[${method}] ${url} Error: ${err.message}`, err.stack);
				throw err;
			}),
		);
	}
}
