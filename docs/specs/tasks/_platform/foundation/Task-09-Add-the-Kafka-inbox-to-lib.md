## Add the Kafka inbox to lib

Needs: [Task-02 — Add a transaction interface for use cases](Task-02-Add-a-transaction-interface-for-use-cases.md),
[Task-06 — Add Redis and BullMQ builders to lib](Task-06-Add-Redis-and-BullMQ-builders-to-lib.md)

Add the inbox to `lib`: the `processed_events` migration that each consuming database copies, and a repository method
that records a batch of event ids inside the caller's transaction and returns only the new ones.

* Primary key `(consumer, event_id)`, and an index on `processed_at`. `event_id` is text: event ids are ULIDs, not
  UUIDs.
* `INSERT ... ON CONFLICT DO NOTHING RETURNING event_id` records and filters in one statement.
* A repeatable BullMQ job deletes rows older than 7 days.

The design is in [kafka-dedup-and-inbox-pattern.md](../../../../explainers/kafka-dedup-and-inbox-pattern.md), Parts 5
and 6.

Why: marking an event handled and applying its effect then succeed or fail together — the thing the Redis reservation
can't do.
