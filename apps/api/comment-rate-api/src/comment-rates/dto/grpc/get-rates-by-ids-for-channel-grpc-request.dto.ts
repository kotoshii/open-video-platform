import { GetRatesByIdsForChannelRequest } from "@ovp-proto/types/comment-rates";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class GetRatesByIdsForChannelGrpcRequestDto implements GetRatesByIdsForChannelRequest {
	@IsUUID(4, { each: true })
	@IsString({ each: true })
	@IsNotEmpty()
	commentIds: string[];

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	channelId: string;
}
