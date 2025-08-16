import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

const DEFAULT_INTERNAL_SERVER_ERROR_USER_FRIENDLY_TEXT = "Something went wrong, try again later";

@Catch()
export class InternalServerErrorFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const { responseBody, statusCode } = this.createResponseBody(exception);

		// TODO: Add logging for Internal server errors.

		return response.status(statusCode).json(responseBody);
	}

	private createResponseBody(exception: unknown) {
		// all explicitly thrown HTTP errors should go to client, even if it's an InternalServerErrorException.
		if (exception instanceof HttpException) {
			return { responseBody: exception.getResponse(), statusCode: exception.getStatus() };
		}

		// unexpected error - treat as 500
		return {
			responseBody: {
				message: "Internal server error",
				error: DEFAULT_INTERNAL_SERVER_ERROR_USER_FRIENDLY_TEXT,
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			},
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
		};
	}
}
