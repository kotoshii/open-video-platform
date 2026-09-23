## Add the event time to the base Kafka event

Add `occurredAt` to the base event payload in `lib/api/kafka`, next to the existing `eventId`: the moment the change
happened, set by the producer when it creates the event.

While there, settle the rules every story's events follow: one topic per owning service, every event keyed by the id of
the entity it is about, and the payload types kept in `lib` next to the topic names.

Why: counting a notification down compares when things happened, never when a worker processed them
([notification-aggregation.md](../../../../explainers/notification-aggregation.md), Part 9). Keying by entity id puts
all of one entity's events on one partition, in order
([scaling-to-multiple-instances.md](../../../../explainers/scaling-to-multiple-instances.md), Part 3).
