import { status as GrpcStatus } from "@grpc/grpc-js";
import { HttpStatus } from "@nestjs/common";

export const GrpcToHttpStatusCode: Record<number, number> = {
	[GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
	[GrpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
	[GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
	[GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
	[GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
	[GrpcStatus.ABORTED]: HttpStatus.GONE,
	[GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
	[GrpcStatus.CANCELLED]: 499,
	[GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
	[GrpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
	[GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
	[GrpcStatus.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
	[GrpcStatus.OUT_OF_RANGE]: HttpStatus.PAYLOAD_TOO_LARGE,
	[GrpcStatus.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_FAILED,
};
