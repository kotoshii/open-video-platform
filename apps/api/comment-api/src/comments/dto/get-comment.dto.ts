import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Selectable } from "kysely";

import { Comment } from "~db/schema";

export class GetCommentDto {
	constructor(comment: Selectable<Comment>) {
		const {
			id,
			videoId,
			channelId,
			channelName,
			content,
			parentId,
			likes,
			dislikes,
			replyCount,
			createdDate,
			updatedDate,
		} = comment;

		this.id = id;
		this.videoId = videoId;
		this.channelId = channelId;
		this.channelName = channelName;
		this.content = content;
		this.parentId = parentId;
		this.likes = likes;
		this.dislikes = dislikes;
		this.replyCount = replyCount;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	@ApiProperty()
	id: string;

	@ApiProperty()
	videoId: string;

	@ApiProperty()
	channelId: string;

	@ApiProperty()
	channelName: string;

	@ApiProperty()
	content: string;

	@ApiProperty({ type: "string", nullable: true })
	parentId: string | null;

	@ApiProperty()
	likes: string;

	@ApiProperty()
	dislikes: string;

	@ApiProperty()
	replyCount: string;

	@ApiProperty()
	createdDate: Date;

	@Exclude()
	updatedDate: Date;
}
