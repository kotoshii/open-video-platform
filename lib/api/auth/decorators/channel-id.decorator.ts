import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ChannelId = createParamDecorator((_, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return (request.channelId || null) as string | null;
});
