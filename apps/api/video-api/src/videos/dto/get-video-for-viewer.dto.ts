import { Exclude } from "class-transformer";

import { VideoSelectedThumbnail, VideoVisibility } from "~db/schema";
import { GetVideoDto } from "~src/videos/dto/get-video.dto";

export class GetVideoForViewerDto extends GetVideoDto {
	@Exclude()
	declare tags: string[];

	@Exclude()
	declare selectedThumbnail: VideoSelectedThumbnail;

	@Exclude()
	declare visibility: VideoVisibility;

	@Exclude()
	declare isPublished: boolean;

	@Exclude()
	declare updatedDate: Date;
}
