import { Metadata, ServiceError } from "@grpc/grpc-js";
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpExceptionBodyMessage,
	HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

import { GrpcToHttpStatusCode } from "~common/constants/grpc-to-http-status-code";
import {
	GRPC_METADATA_HTTP_ERROR,
	GRPC_METADATA_HTTP_MESSAGE,
	GRPC_METADATA_HTTP_STATUS,
} from "~grpc/constants/metadata";

interface ErrorWithOriginalError {
	originalError: Error;
}

interface ErrorWithMetadata {
	metadata: unknown;
}

const DEFAULT_INTERNAL_SERVER_ERROR_USER_FRIENDLY_TEXT = "Something went wrong, try again later";

@Catch()
export class InternalServerErrorFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const { responseBody, statusCode } = this.createResponseBody(this.extractError(exception));

		// TODO: Add logging for Internal server errors.

		return response.status(statusCode).json(responseBody);
	}

	private createResponseBody(exception: unknown) {
		// all explicitly thrown HTTP errors should go to client, even if it's an InternalServerErrorException.
		if (exception instanceof HttpException) {
			return { responseBody: exception.getResponse(), statusCode: exception.getStatus() };
		}

		if (this.isGrpcException(exception)) {
			const httpMessage = exception.metadata.get(GRPC_METADATA_HTTP_MESSAGE)?.at(0) as
				| HttpExceptionBodyMessage
				| undefined;
			const httpError = exception.metadata.get(GRPC_METADATA_HTTP_ERROR)?.at(0) as string | undefined;
			const httpStatus =
				(exception.metadata.get(GRPC_METADATA_HTTP_STATUS)?.at(0) as string | undefined) ||
				GrpcToHttpStatusCode[exception.code];

			const statusCode = httpStatus ? (typeof httpStatus === "string" ? parseInt(httpStatus, 10) : httpStatus) : null;

			if (httpMessage && httpError && statusCode) {
				return {
					responseBody: {
						message: httpMessage,
						error: httpError,
						statusCode,
					},
					statusCode,
				};
			}
		}

		// unexpected error - treat as 500
		return {
			responseBody: {
				message: "Internal Server Error",
				error: DEFAULT_INTERNAL_SERVER_ERROR_USER_FRIENDLY_TEXT,
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			},
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
		};
	}

	private isGrpcException(exception: unknown): exception is ServiceError {
		return this.isErrorWithMetadata(exception);
	}

	private extractError(exception: unknown) {
		if (this.isErrorWithOriginalError(exception)) {
			return exception.originalError;
		}

		if (exception instanceof Error) {
			return exception;
		}

		if (typeof exception === "string") {
			return new Error(exception);
		}

		return new Error(`Unknown error: ${String(exception)}`);
	}

	private isErrorWithOriginalError(exception: unknown): exception is ErrorWithOriginalError {
		return (
			exception !== null &&
			typeof exception === "object" &&
			"originalError" in exception &&
			exception.originalError instanceof Error
		);
	}

	private isErrorWithMetadata(exception: unknown): exception is ErrorWithMetadata {
		return (
			exception !== null &&
			typeof exception === "object" &&
			"metadata" in exception &&
			exception.metadata instanceof Metadata
		);
	}
}
