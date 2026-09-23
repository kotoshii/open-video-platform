## Rebuild the count worker base on the inbox

Needs: [foundation Task-09 — Add the Kafka inbox to lib](../foundation/Task-09-Add-the-Kafka-inbox-to-lib.md)

Rebuild `BaseCountWorkerService` in `lib/workers` on the inbox, as
[kafka-dedup-and-inbox-pattern.md](../../../../explainers/kafka-dedup-and-inbox-pattern.md), Part 6 describes, and drop
the Redis reservation from this path.

Main flow:

1. Open a transaction.
2. Record the batch's event ids in the inbox, and keep only the events that were new.
3. Sum the deltas of the new events and apply them in one statement.
4. Commit.

Branch — every event in the batch is a duplicate:

1. Apply nothing and commit.

Branch — the transaction fails:

1. Resolve no offsets, so Kafka delivers the batch again. Nothing was recorded, so the retry applies it normally.

Why: today the ids are marked handled in Redis before the counts reach Postgres, so a failed write turns into a batch
that is skipped forever and a partition that stops moving ([known-issues.md](../../../../known-issues.md)).
