import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import { createRedisConnection } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

import { KAFKA_DEDUP_CONFIG_INJECTION_TOKEN } from "~config/constants/injection-tokens";
import { ICommonKafkaDedupConfig } from "~config/interfaces/common-kafka-dedup-config.interface";

const RESERVED_PREFIX = "kafka-event-id:reserved";
const EVENT_RECORD_VALUE = ""; // just an empty string to save memory - we only need to check for existence

// TODO: we probably need to have some safeguards for multi-instance setup,
//  when different workers may consume the same Kafka topic.
//  e.g. save process.id (or other worker instance ID) as reserved event value, instead of empty string,
//  and then process only the events with the same instance ID as the current worker instance.

@Injectable()
export class KafkaDeduplicationService implements OnModuleDestroy {
	private readonly redis: Redis;

	constructor(@Inject(KAFKA_DEDUP_CONFIG_INJECTION_TOKEN) private readonly kafkaDedupConfig: ICommonKafkaDedupConfig) {
		this.redis = createRedisConnection({ type: "single", url: this.kafkaDedupConfig.kafkaDedupRedisUrl }) as Redis;
	}

	async onModuleDestroy() {
		this.redis.disconnect();
	}

	async reserveEventIds(eventIds: string[]): Promise<string[]> {
		if (!eventIds.length) {
			return [];
		}

		const pipeline = this.redis.pipeline();

		for (const id of eventIds) {
			pipeline.call("SET", this.buildRedisKey(id), EVENT_RECORD_VALUE, "EX", this.kafkaDedupConfig.kafkaDedupTtl, "NX");
		}

		const results = await pipeline.exec();

		const reserved: string[] = [];
		// todo add better error handling - here and in other similar services
		results?.forEach((res, i) => {
			if (res[1] === "OK") {
				reserved.push(eventIds[i]);
			}
		});

		return reserved;
	}

	private buildRedisKey(eventId: string) {
		return `${RESERVED_PREFIX}:${eventId}`;
	}
}
