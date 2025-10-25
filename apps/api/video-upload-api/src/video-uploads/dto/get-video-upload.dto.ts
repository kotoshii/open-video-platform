import { ApiProperty } from "@nestjs/swagger";
import { Selectable } from "kysely";

import { VideoUpload, VideoUploadStatus } from "~db/schema";

export class GetVideoUploadDto {
	constructor(videoUpload: Selectable<VideoUpload>) {
		const {
			id,
			channelId,
			videoId,
			status,
			originalFilename,
			originalSize,
			originalMimetype,
			createdDate,
			updatedDate,
		} = videoUpload;

		this.id = id;
		this.channelId = channelId;
		this.videoId = videoId;
		this.status = status;
		this.originalFilename = originalFilename;
		this.originalSize = originalSize;
		this.originalMimetype = originalMimetype;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	@ApiProperty()
	id: string;

	@ApiProperty()
	channelId: string;

	@ApiProperty()
	videoId: string;

	@ApiProperty({ enum: VideoUploadStatus })
	status: VideoUploadStatus;

	@ApiProperty()
	originalFilename: string;

	@ApiProperty()
	originalSize: string;

	@ApiProperty()
	originalMimetype: string;

	@ApiProperty()
	createdDate: Date;

	@ApiProperty()
	updatedDate: Date;
}
