import { Video as VideoGrpcResponse } from "@ovp-proto/types/videos";
import { Selectable } from "kysely";

import { Video as VideoDbEntity, VideoSelectedThumbnail, VideoVisibility } from "~db/schema";

export class GetVideoGrpcResponseDto implements VideoGrpcResponse {
	constructor(video: Selectable<VideoDbEntity>) {
		const {
			id,
			channelId,
			channelName,
			title,
			description,
			tags,
			allowComments,
			allowRates,
			selectedThumbnail,
			visibility,
			isPublished,
			isNsfw,
			viewCount,
			likes,
			dislikes,
			createdDate,
			updatedDate,
		} = video;

		this.id = id;
		this.channelId = channelId;
		this.channelName = channelName;
		this.title = title;
		this.description = description || undefined;
		this.tags = tags;
		this.allowComments = allowComments;
		this.allowRates = allowRates;
		this.selectedThumbnail = selectedThumbnail;
		this.visibility = visibility;
		this.isPublished = isPublished;
		this.isNsfw = isNsfw;
		this.viewCount = viewCount;
		this.likes = likes;
		this.dislikes = dislikes;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	id: string;

	channelId: string;

	channelName: string;

	title: string;

	description?: string;

	tags: string[];

	allowComments: boolean;

	allowRates: boolean;

	selectedThumbnail: VideoSelectedThumbnail;

	visibility: VideoVisibility;

	isPublished: boolean;

	isNsfw: boolean;

	viewCount: string;

	likes: string;

	dislikes: string;

	createdDate: Date;

	updatedDate: Date;
}
