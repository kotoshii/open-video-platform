## Migrate comment-rate-api to the new structure

Move `comment-rate-api` to the new module layout and wire it into Compose, the database init, the migration container,
its Kafka topics and the gateway route.

* Its events go through the outbox in `lib`. That replaces the saga which deletes the rate row when the Kafka publish
  fails — and which, with an empty compensator on the publish step, admits there is nothing to undo
  ([kafka-dedup-and-inbox-pattern.md](../../../../../explainers/kafka-dedup-and-inbox-pattern.md), Part 9).

Why: the stories promise that counts are eventually consistent and that the button state confirms the click. Rolling a
rate back when Kafka is unavailable turns a few seconds of lag into "nobody can rate anything while Kafka is down".
