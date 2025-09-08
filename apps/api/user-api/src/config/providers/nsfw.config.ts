import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NsfwConfig {
	constructor(private readonly config: ConfigService) {}

	get allowNsfwFromYears() {
		return parseInt(this.config.get<string>("ALLOW_NSFW_FROM_YEARS", "18"), 10);
	}
}
