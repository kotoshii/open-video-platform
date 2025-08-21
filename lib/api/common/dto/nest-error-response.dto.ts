import { HttpExceptionBody, HttpExceptionBodyMessage } from "@nestjs/common";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";

/*
 * This class is needed only to document default Nest.js error response in Swagger.
 * Thus, it should be only used within Swagger decorators.
 * To throw errors from the app use built-in Exception classes like `InternalServerErrorException()` etc.
 * */
@ApiExtraModels()
export abstract class NestErrorResponseDto implements HttpExceptionBody {
	@ApiProperty({
		// typescript compiler complains about circular deps when using this class in monorepo (importing from lib/api);
		// adding explicit type to the decorator fixes it (everything is Object).
		type: () => Object,
		oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }, { type: "number" }],
		description: "Can be either string, string[] or number",
	})
	abstract message: HttpExceptionBodyMessage;

	@ApiProperty({ type: () => String, required: false })
	abstract error?: string;

	@ApiProperty({ type: () => Number })
	abstract statusCode: number;
}
