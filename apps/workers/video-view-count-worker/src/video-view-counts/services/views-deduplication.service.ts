import { Injectable } from "@nestjs/common";
import { createRedisConnection } from "@nestjs-modules/ioredis";
import { KafkaEventTypes } from "@ovp-lib/api/kafka/constants/event-types";
import { VideoKafkaEventPayload } from "@ovp-lib/api/kafka/types/events/videos";
import { KafkaEventPayloadWithOffset } from "@ovp-lib/workers/counts/types/kafka-event-payload-with-offset";
import Redis from "ioredis";

import { ViewsDedupConfig } from "~src/config/providers/views-dedup.config";

const RESERVED_PREFIX = "video-view";
const EVENT_RECORD_VALUE = ""; // just an empty string to save memory - we only need to check for existence

@Injectable()
export class ViewsDeduplicationService {
	private readonly redis: Redis;

	constructor(private readonly viewsDedupConfig: ViewsDedupConfig) {
		this.redis = createRedisConnection({ type: "single", url: this.viewsDedupConfig.viewsDedupRedisUrl }) as Redis;
	}

	async onModuleDestroy() {
		this.redis.disconnect();
	}

	async getNewViewEvents(
		events: KafkaEventPayloadWithOffset<VideoKafkaEventPayload>[],
	): Promise<KafkaEventPayloadWithOffset<VideoKafkaEventPayload>[]> {
		const validViewEvents = events.filter(
			(event) =>
				event.payload.type === KafkaEventTypes.Videos.VideoViewed &&
				(Boolean(event.payload.viewerId) || (Boolean(event.payload.ipAddress) && Boolean(event.payload.userAgent))),
		);

		if (!validViewEvents.length) {
			return [];
		}

		const pipeline = this.redis.pipeline();

		for (const event of validViewEvents) {
			pipeline.call(
				"SET",
				// biome-ignore lint/style/noNonNullAssertion: <see validViewEvents filtering>
				this.buildRedisKey(event.payload)!,
				EVENT_RECORD_VALUE,
				"EX",
				this.viewsDedupConfig.viewsDedupTtl,
				"NX",
			);
		}

		const results = await pipeline.exec();
		const reserved: KafkaEventPayloadWithOffset<VideoKafkaEventPayload>[] = [];

		results?.forEach((res, i) => {
			if (res[1] === "OK") {
				reserved.push(validViewEvents[i]);
			}
		});

		return reserved;
	}

	private buildRedisKey(payload: VideoKafkaEventPayload) {
		const { viewerId, ipAddress, userAgent } = payload;

		if (viewerId) {
			return this.buildRedisKeyForViewerId(viewerId);
		}

		if (ipAddress && userAgent) {
			return this.buildRedisKeyForIpAndUA(ipAddress, userAgent);
		}

		return null;
	}

	private buildRedisKeyForViewerId(viewerId: string) {
		return `${RESERVED_PREFIX}:${btoa(viewerId)}`;
	}

	private buildRedisKeyForIpAndUA(ipAddress: string, userAgent: string) {
		return `${RESERVED_PREFIX}:${btoa(`${ipAddress}_${userAgent}`)}`;
	}
}
