import { Expose } from "class-transformer";

import { GetVideoDto } from "~src/videos/dto/get-video.dto";

export class GetVideoForViewerDto extends GetVideoDto {
	@Expose()
	declare id: string;

	@Expose()
	declare channelId: string;

	@Expose()
	declare channelName: string;

	@Expose()
	declare title: string;

	@Expose()
	declare description: string | null;

	@Expose()
	declare allowComments: boolean;

	@Expose()
	declare allowRates: boolean;

	@Expose()
	declare isNsfw: boolean;

	@Expose()
	declare viewCount: string;

	@Expose()
	declare likes: string;

	@Expose()
	declare dislikes: string;

	@Expose()
	declare createdDate: Date;
}
