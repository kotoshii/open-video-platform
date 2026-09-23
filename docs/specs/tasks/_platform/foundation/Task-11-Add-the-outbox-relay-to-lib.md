## Add the outbox relay to lib

Needs: [Task-10 — Add the transactional outbox to lib](Task-10-Add-the-transactional-outbox-to-lib.md)

Add the relay that publishes outbox rows to Kafka. Every service with an outbox runs it.

Main flow:

1. Every second or so, try to take a Postgres advisory lock for this service; if another instance holds it, skip the
   round.
2. Read unpublished rows in `id` order, a batch at a time.
3. Publish them in that order, with their keys.
4. Mark them published once the broker acks.
5. Now and then, delete rows published more than a few days ago.

Branch — Kafka is unavailable:

1. Leave the rows unpublished and try again next round. No request waits on it.

Why: one relay per service at a time keeps each key's events in order. Several relays sharing rows with `SKIP LOCKED`
would publish row 7 before row 5
([scaling-to-multiple-instances.md](../../../../explainers/scaling-to-multiple-instances.md), Part 7).
