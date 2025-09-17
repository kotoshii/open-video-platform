import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import type { Selectable } from "kysely";

import { CommentRate, CommentRateType } from "~db/schema";

export class GetCommentRateDto {
	constructor(videoRate: Selectable<CommentRate>) {
		const { id, commentId, channelId, type, createdDate, updatedDate } = videoRate;

		this.id = id;
		this.commentId = commentId;
		this.channelId = channelId;
		this.type = type;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	@ApiProperty()
	id: string;

	@ApiProperty()
	commentId: string;

	@ApiProperty()
	channelId: string;

	@ApiProperty({ enum: CommentRateType })
	type: CommentRateType;

	@ApiProperty()
	createdDate: Date;

	@Exclude()
	updatedDate: Date;
}
