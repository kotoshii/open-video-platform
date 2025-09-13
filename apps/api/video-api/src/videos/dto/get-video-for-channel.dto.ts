import { ExposeIf } from "@ovp-lib/api/serialization/decorators/expose-if.decorator";
import { Exclude, Expose } from "class-transformer";
import { Selectable } from "kysely";

import { Video, VideoVisibility } from "~db/schema";
import { GetVideoDto } from "~src/videos/dto/get-video.dto";

export class GetVideoForChannelDto extends GetVideoDto {
	@Exclude()
	private readonly isAuthor: boolean;

	constructor(video: Selectable<Video>, isAuthor: boolean = false) {
		super(video);
		this.isAuthor = isAuthor;
	}

	@Expose()
	declare id: string;

	@Expose()
	declare title: string;

	@ExposeIf((obj) => obj.isAuthor)
	declare visibility: VideoVisibility;

	@ExposeIf((obj) => obj.isAuthor)
	declare isPublished: boolean;

	@Expose()
	declare isNsfw: boolean;

	@Expose()
	declare viewCount: string;

	@Expose()
	declare createdDate: Date;

	static fromArray(videos: Selectable<Video>[], isAuthor: boolean = false) {
		return videos.map((video) => new GetVideoForChannelDto(video, isAuthor));
	}
}
