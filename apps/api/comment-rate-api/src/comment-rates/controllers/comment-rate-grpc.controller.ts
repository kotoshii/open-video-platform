import { Payload } from "@nestjs/microservices";
import { GrpcController } from "@ovp-lib/api/grpc/decorators/grpc-controller.decorator";
import { CommentRateServiceController, CommentRateServiceControllerMethods } from "@ovp-proto/types/comment-rates";

import { GetRatesByIdsForChannelGrpcRequestDto } from "~src/comment-rates/dto/grpc/get-rates-by-ids-for-channel-grpc-request.dto";
import { GetRatesByIdsForChannelGrpcResponseDto } from "~src/comment-rates/dto/grpc/get-rates-by-ids-for-channel-grpc-response.dto";
import { CommentRateService } from "~src/comment-rates/services/comment-rate.service";

@GrpcController()
@CommentRateServiceControllerMethods()
export class CommentRateGrpcController implements CommentRateServiceController {
	constructor(private readonly commentRateService: CommentRateService) {}

	async getRatesByIdsForChannel(
		@Payload() body: GetRatesByIdsForChannelGrpcRequestDto,
	): Promise<GetRatesByIdsForChannelGrpcResponseDto> {
		const { commentIds, channelId } = body;
		const commentRates = await this.commentRateService.getCommentRatesByIdsForChannel(commentIds, channelId);

		return new GetRatesByIdsForChannelGrpcResponseDto(commentRates);
	}
}
