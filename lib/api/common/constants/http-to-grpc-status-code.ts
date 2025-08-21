import { status as GrpcStatus } from "@grpc/grpc-js";
import { HttpStatus } from "@nestjs/common";

export const HttpToGrpcStatusCode: Record<number, number> = {
	[HttpStatus.BAD_REQUEST]: GrpcStatus.INVALID_ARGUMENT,
	[HttpStatus.UNAUTHORIZED]: GrpcStatus.UNAUTHENTICATED,
	[HttpStatus.FORBIDDEN]: GrpcStatus.PERMISSION_DENIED,
	[HttpStatus.NOT_FOUND]: GrpcStatus.NOT_FOUND,
	[HttpStatus.CONFLICT]: GrpcStatus.ALREADY_EXISTS,
	[HttpStatus.GONE]: GrpcStatus.ABORTED,
	[HttpStatus.TOO_MANY_REQUESTS]: GrpcStatus.RESOURCE_EXHAUSTED,
	499: GrpcStatus.CANCELLED,
	[HttpStatus.INTERNAL_SERVER_ERROR]: GrpcStatus.INTERNAL,
	[HttpStatus.NOT_IMPLEMENTED]: GrpcStatus.UNIMPLEMENTED,
	[HttpStatus.BAD_GATEWAY]: GrpcStatus.UNKNOWN,
	[HttpStatus.SERVICE_UNAVAILABLE]: GrpcStatus.UNAVAILABLE,
	[HttpStatus.GATEWAY_TIMEOUT]: GrpcStatus.DEADLINE_EXCEEDED,
	[HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: GrpcStatus.UNAVAILABLE,
	[HttpStatus.PAYLOAD_TOO_LARGE]: GrpcStatus.OUT_OF_RANGE,
	[HttpStatus.UNSUPPORTED_MEDIA_TYPE]: GrpcStatus.CANCELLED,
	[HttpStatus.UNPROCESSABLE_ENTITY]: GrpcStatus.CANCELLED,
	[HttpStatus.I_AM_A_TEAPOT]: GrpcStatus.UNKNOWN,
	[HttpStatus.METHOD_NOT_ALLOWED]: GrpcStatus.CANCELLED,
	[HttpStatus.PRECONDITION_FAILED]: GrpcStatus.FAILED_PRECONDITION,
};
