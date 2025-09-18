import { CommentRateGrpcType, GetRatesByIdsForChannelResponse } from "@ovp-proto/types/comment-rates";

import { CommentRateType } from "~db/schema";
import { GetCommentRateDto } from "~src/comment-rates/dto/get-comment-rate.dto";

const getCommentRateGrpcType = (dbType: CommentRateType) => {
	if (dbType === CommentRateType.Like) return CommentRateGrpcType.COMMENT_RATE_GRPC_TYPE_LIKE;
	if (dbType === CommentRateType.Dislike) return CommentRateGrpcType.COMMENT_RATE_GRPC_TYPE_DISLIKE;
};

export class GetRatesByIdsForChannelGrpcResponseDto implements GetRatesByIdsForChannelResponse {
	constructor(commentRates: GetCommentRateDto[]) {
		this.rates = commentRates.reduce<Record<string, CommentRateGrpcType>>((acc, curr) => {
			const grpcType = getCommentRateGrpcType(curr.type);
			if (grpcType) {
				acc[curr.commentId] = grpcType;
			}
			return acc;
		}, {});
	}

	rates: Record<string, CommentRateGrpcType>;
}
