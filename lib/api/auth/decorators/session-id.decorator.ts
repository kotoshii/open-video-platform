import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const SessionId = createParamDecorator((_, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return (request.sessionId || null) as string | null;
});
