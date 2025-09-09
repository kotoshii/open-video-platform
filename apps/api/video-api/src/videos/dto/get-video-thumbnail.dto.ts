import { ApiProperty } from "@nestjs/swagger";

import { VideoSelectedThumbnail } from "~db/schema";
import { VideoThumbnail } from "~src/videos/types/video-thumbnail";

export class GetVideoThumbnailDto {
	constructor(thumbnail: VideoThumbnail) {
		const { type, url } = thumbnail;

		this.type = type;
		this.url = url;
	}

	@ApiProperty({ enum: VideoSelectedThumbnail })
	type: VideoSelectedThumbnail;

	@ApiProperty()
	url: string;

	toPlain(): VideoThumbnail {
		return {
			type: this.type,
			url: this.url,
		};
	}

	static fromArray(thumbnails: VideoThumbnail[]) {
		return thumbnails.map((thumbnail) => new GetVideoThumbnailDto(thumbnail));
	}
}
