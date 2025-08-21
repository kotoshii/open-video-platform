import { status as GrpcStatus, Metadata } from "@grpc/grpc-js";
import { Catch, HttpException, HttpExceptionBody, RpcExceptionFilter } from "@nestjs/common";
import { toArray } from "@ovp-lib/common/utils/arrays";
import { Observable, throwError } from "rxjs";

import { HttpToGrpcStatusCode } from "~common/constants/http-to-grpc-status-code";
import {
	GRPC_METADATA_HTTP_ERROR,
	GRPC_METADATA_HTTP_MESSAGE,
	GRPC_METADATA_HTTP_STATUS,
} from "~grpc/constants/metadata";

interface HttpErrorResponse extends HttpExceptionBody {
	details?: unknown;
}

@Catch(HttpException)
export class HttpToGrpcExceptionFilter implements RpcExceptionFilter {
	catch(exception: HttpException): Observable<never> {
		const httpStatus = exception.getStatus();
		const httpResponse = exception.getResponse() as HttpErrorResponse;

		const code = HttpToGrpcStatusCode[httpStatus] ?? GrpcStatus.UNKNOWN;
		const message = httpResponse.message || exception.message;
		const details = toArray(httpResponse.details || message);

		const metadata = new Metadata();
		metadata.add(GRPC_METADATA_HTTP_MESSAGE, String(httpResponse.message));
		metadata.add(GRPC_METADATA_HTTP_ERROR, String(httpResponse.error));
		metadata.add(GRPC_METADATA_HTTP_STATUS, String(httpStatus));

		return throwError(() => ({
			code,
			message,
			details,
			metadata,
		}));
	}
}
