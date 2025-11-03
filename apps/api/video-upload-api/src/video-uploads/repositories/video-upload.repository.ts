import { Injectable } from "@nestjs/common";
import { Insertable, Kysely } from "kysely";
import { InjectKysely } from "nestjs-kysely";

import { DB, VideoUpload } from "~db/schema";

@Injectable()
export class VideoUploadRepository {
	constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

	async createVideoUpload(data: Insertable<VideoUpload>) {
		return this.db.insertInto("videoUploads").values(data).returningAll().executeTakeFirstOrThrow();
	}

	async getVideoUploadByVideoId(videoId: string) {
		return this.videoUploadQuery.where("videoId", "=", videoId).executeTakeFirst();
	}

	private get videoUploadQuery() {
		return this.db
			.selectFrom("videoUploads")
			.select("id")
			.select("channelId")
			.select("videoId")
			.select("status")
			.select("originalFilename")
			.select("originalSize")
			.select("originalMimetype")
			.select("createdDate")
			.select("updatedDate");
	}
}
