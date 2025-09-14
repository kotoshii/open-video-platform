import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import type { Selectable } from "kysely";

import { VideoRate, VideoRateType } from "~db/schema";

export class GetVideoRateDto {
	constructor(videoRate: Selectable<VideoRate>) {
		const { id, videoId, channelId, type, createdDate, updatedDate } = videoRate;

		this.id = id;
		this.videoId = videoId;
		this.channelId = channelId;
		this.type = type;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	@ApiProperty()
	id: string;

	@ApiProperty()
	videoId: string;

	@ApiProperty()
	channelId: string;

	@ApiProperty({ enum: VideoRateType })
	type: VideoRateType;

	@ApiProperty()
	createdDate: Date;

	@Exclude()
	updatedDate: Date;
}
