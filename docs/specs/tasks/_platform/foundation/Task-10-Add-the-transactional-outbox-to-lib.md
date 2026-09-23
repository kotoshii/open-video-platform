## Add the transactional outbox to lib

Needs: [Task-02 — Add a transaction interface for use cases](Task-02-Add-a-transaction-interface-for-use-cases.md),
[Task-08 — Add the event time to the base Kafka event](Task-08-Add-the-event-time-to-the-base-Kafka-event.md)

Add the `outbox` migration and a repository method `add(topic, key, payload)` that writes an event row inside the
caller's transaction. Services call it in the same transaction as the change the event announces, instead of calling
the Kafka producer.

* Store the serialized payload, so the `eventId` is fixed once and every republish carries the same id.
* Store the current `traceparent` with the row, so the relay can continue the trace
  ([observability Task-07](../observability/Task-07-Carry-trace-context-through-the-outbox-and-Kafka.md)).

Why: a change is then never saved without its event, and the request never waits on Kafka
([kafka-dedup-and-inbox-pattern.md](../../../../explainers/kafka-dedup-and-inbox-pattern.md), Part 9).
