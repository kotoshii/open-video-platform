import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Selectable } from "kysely";

import { Video, VideoSelectedThumbnail, VideoVisibility } from "~db/schema";
import { GetVideoDto } from "~src/videos/dto/get-video.dto";
import { GetVideoThumbnailDto } from "~src/videos/dto/get-video-thumbnail.dto";
import { VideoThumbnail } from "~src/videos/types/video-thumbnail";

export class GetVideoForEditingDto extends GetVideoDto {
	constructor(video: Selectable<Video>, thumbnails: VideoThumbnail[]) {
		super(video);

		this.thumbnails = GetVideoThumbnailDto.fromArray(thumbnails);
	}

	@Expose()
	declare id: string;

	@Expose()
	declare title: string;

	@Expose()
	declare description: string | null;

	@Expose()
	declare tags: string[];

	@Expose()
	declare allowComments: boolean;

	@Expose()
	declare allowRates: boolean;

	@ApiProperty({ type: [GetVideoThumbnailDto] })
	thumbnails: GetVideoThumbnailDto[];

	@Expose()
	declare selectedThumbnail: VideoSelectedThumbnail;

	@Expose()
	declare visibility: VideoVisibility;

	@Expose()
	declare isNsfw: boolean;

	@Expose()
	declare createdDate: Date;
}
