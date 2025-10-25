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
}
