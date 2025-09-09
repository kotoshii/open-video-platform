import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Selectable } from "kysely";

import { Video } from "~db/schema";
import { GetVideoDto } from "~src/videos/dto/get-video.dto";
import { GetVideoThumbnailDto } from "~src/videos/dto/get-video-thumbnail.dto";
import { VideoThumbnail } from "~src/videos/types/video-thumbnail";

export class GetVideoForEditingDto extends GetVideoDto {
	constructor(video: Selectable<Video>, thumbnails: VideoThumbnail[]) {
		super(video);

		this.thumbnails = GetVideoThumbnailDto.fromArray(thumbnails);
	}

	@ApiProperty({ type: [GetVideoThumbnailDto] })
	thumbnails: GetVideoThumbnailDto[];

	@Exclude()
	declare channelId: string;

	@Exclude()
	declare channelName: string;

	@Exclude()
	declare isPublished: boolean;

	@Exclude()
	declare viewCount: string;

	@Exclude()
	declare likes: string;

	@Exclude()
	declare dislikes: string;

	@Exclude()
	declare updatedDate: Date;
}
