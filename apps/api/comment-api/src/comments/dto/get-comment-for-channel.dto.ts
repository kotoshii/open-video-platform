import { ApiProperty } from "@nestjs/swagger";
import { CommentRateType } from "@ovp-lib/api/kafka/types/events/comment-rates";
import { CommentRateGrpcType } from "@ovp-proto/types/comment-rates";
import { Selectable } from "kysely";

import { Comment } from "~db/schema";
import { GetCommentDto } from "~src/comments/dto/get-comment.dto";

const getCommentRateTypeByGrpcRateType = (grpcType: CommentRateGrpcType | undefined): CommentRateType | null => {
	if (grpcType === CommentRateGrpcType.COMMENT_RATE_GRPC_TYPE_LIKE) return "like";
	if (grpcType === CommentRateGrpcType.COMMENT_RATE_GRPC_TYPE_DISLIKE) return "dislike";
	return null;
};

export class GetCommentForChannelDto extends GetCommentDto {
	constructor(comment: Selectable<Comment>, currentChannelRate: CommentRateType | null) {
		super(comment);

		this.currentChannelRate = currentChannelRate;
	}

	@ApiProperty({ nullable: true, type: "string", enum: ["like", "dislike"] })
	currentChannelRate: CommentRateType | null;

	static fromArray(comments: Selectable<Comment>[], commentRatesMap: Record<string, CommentRateGrpcType> = {}) {
		return comments.map(
			(comment) => new GetCommentForChannelDto(comment, getCommentRateTypeByGrpcRateType(commentRatesMap[comment.id])),
		);
	}
}
