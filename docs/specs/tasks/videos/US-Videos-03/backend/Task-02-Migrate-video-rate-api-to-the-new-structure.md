## Migrate video-rate-api to the new structure

Move `video-rate-api` to the new module layout and wire it into Compose, the database init, the migration container, its
Kafka topics and the gateway route.

* Its events go through the outbox in `lib` — replacing the saga that rolls a rate back when Kafka is unavailable
  ([kafka-dedup-and-inbox-pattern.md](../../../../../explainers/kafka-dedup-and-inbox-pattern.md), Part 9).

Why: deleting a video deletes its rates, so this service comes in here; its own story follows two stories later.
