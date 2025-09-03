import { Inject, Injectable } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

import { KAFKA_DEDUP_CONFIG_INJECTION_TOKEN } from "~config/constants/injection-tokens";
import { ICommonKafkaDedupConfig } from "~config/interfaces/common-kafka-dedup-config.interface";

const PROCESSED_PREFIX = "kafka-event-id:processed";
const EVENT_RECORD_VALUE = ""; // just an empty string to save memory - we only need to check for existence

@Injectable()
export class KafkaDeduplicationService {
	constructor(
		@InjectRedis() private readonly redis: Redis,
		@Inject(KAFKA_DEDUP_CONFIG_INJECTION_TOKEN) private readonly kafkaDedupConfig: ICommonKafkaDedupConfig,
	) {}

	async checkBatchProcessed(eventIds: string[]): Promise<Set<string>> {
		if (!eventIds.length) {
			return new Set();
		}

		const pipeline = this.redis.pipeline();

		eventIds.forEach((id) => {
			pipeline.exists(this.buildRedisKey(id));
		});

		const results = await pipeline.exec();
		const processedIds = new Set<string>();

		results?.forEach((result, index) => {
			if (result && result[1] === 1) {
				processedIds.add(eventIds[index]);
			}
		});

		return processedIds;
	}

	async markBatchProcessed(eventIds: string[]): Promise<void> {
		if (!eventIds.length) {
			return;
		}

		const pipeline = this.redis.pipeline();

		eventIds.forEach((id) => {
			pipeline.setex(this.buildRedisKey(id), this.kafkaDedupConfig.kafkaDedupTtl, EVENT_RECORD_VALUE);
		});

		await pipeline.exec();
	}

	async isProcessed(eventId: string): Promise<boolean> {
		const exists = await this.redis.exists(this.buildRedisKey(eventId));
		return exists === 1;
	}

	async markProcessed(eventId: string): Promise<void> {
		await this.redis.setex(this.buildRedisKey(eventId), this.kafkaDedupConfig.kafkaDedupTtl, EVENT_RECORD_VALUE);
	}

	private buildRedisKey(eventId: string) {
		return `${PROCESSED_PREFIX}:${eventId}`;
	}
}
