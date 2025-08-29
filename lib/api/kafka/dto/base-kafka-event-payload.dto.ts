import { ulid } from "ulid";

import { BaseKafkaEventPayload } from "~kafka/types/events/base-kafka-event-payload";

type BaseKafkaEventPayloadDtoClassWithStaticFields = BaseKafkaEventPayloadDto & { EventType: string };

type BuildPayloadReturnType<
	TBase extends BaseKafkaEventPayloadDtoClassWithStaticFields,
	TExtraFields extends object,
> = BaseKafkaEventPayload & TExtraFields & { type: TBase["EventType"] };

export abstract class BaseKafkaEventPayloadDto {
	static readonly EventType: string;

	protected static buildPayload<
		TBase extends BaseKafkaEventPayloadDtoClassWithStaticFields,
		TExtraFields extends object,
	>(this: TBase, extraFields: TExtraFields): BuildPayloadReturnType<TBase, TExtraFields> {
		return {
			eventId: ulid(),
			timestamp: Date.now(),
			type: BaseKafkaEventPayloadDto.EventType,
			...extraFields,
		};
	}
}
