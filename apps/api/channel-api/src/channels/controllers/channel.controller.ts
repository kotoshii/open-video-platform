import { Body, Controller, Get, Param, Put, UnauthorizedException } from "@nestjs/common";
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse } from "@nestjs/swagger";
import { ChannelId } from "@ovp-lib/api/auth/decorators/channel-id.decorator";
import { NestErrorResponseDto } from "@ovp-lib/api/common/dto/nest-error-response.dto";

import { GetChannelDto } from "~src/channels/dto/get-channel.dto";
import { UpdateChannelDto } from "~src/channels/dto/update-channel.dto";
import { ChannelService } from "~src/channels/services/channel.service";

@Controller("channels")
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

	@ApiOkResponse({ type: GetChannelDto })
	@Get("current")
	async getCurrentChannel(@ChannelId() channelId: string | null) {
		if (!channelId) {
			throw new UnauthorizedException();
		}
		return this.channelService.getCurrentChannelByIdOrThrow(channelId);
	}

	@ApiOkResponse({ type: GetChannelDto })
	@ApiBadRequestResponse({ type: NestErrorResponseDto, description: "Params validation failed" })
	@Put("current")
	async updateCurrentChannel(@ChannelId() channelId: string | null, @Body() body: UpdateChannelDto) {
		if (!channelId) {
			throw new UnauthorizedException();
		}
		return this.channelService.updateCurrentChannelByIdOrThrow(channelId, body);
	}

	@ApiOkResponse({ type: GetChannelDto })
	@ApiNotFoundResponse({ type: NestErrorResponseDto, description: "Channel not found" })
	@Get(":id")
	async getChannelById(@Param("id") channelId: string, @ChannelId() subscriberId: string) {
		return this.channelService.getChannelByIdOrThrow(channelId, subscriberId);
	}
}
