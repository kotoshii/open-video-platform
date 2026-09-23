## Create notification-worker

Needs: [Task-01 — Create notification-api](Task-01-Create-notification-api.md),
[_platform foundation Task-09 — Add the Kafka inbox to lib](../../../_platform/foundation/Task-09-Add-the-Kafka-inbox-to-lib.md),
[_platform foundation Task-06 — Add Redis and BullMQ builders to lib](../../../_platform/foundation/Task-06-Add-Redis-and-BullMQ-builders-to-lib.md)

Create `notification-worker` in the new structure and wire it into Compose, its Kafka topics and Redis for BullMQ. It
belongs to `notification-api`: it writes that service's tables with its credentials, and its inbox lives in that
database.

Consume in batches: record the event ids in the inbox, group the new events by key in memory, and write one statement
per group — all in one transaction.

Why: do not build it on the old count worker deduplication, which reserves event ids before writing and loses events
when a write fails ([known-issues.md](../../../../../known-issues.md)). Here the ids and the writes commit together, so
a redelivered batch changes nothing, in either direction.
