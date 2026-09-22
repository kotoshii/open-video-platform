## Migrate subscription-api to the new structure

Move `subscription-api` to the new module layout and wire it into Compose, the database init, the migration container,
its Kafka topics and the gateway route.

* Its events go through the outbox in `lib`, and its consumers through the inbox.
* A subscription is a pair of channels — the subscriber and the subscribed — with a unique constraint on the pair.

Why: the pair being unique is what makes a repeated subscribe request harmless, instead of a check in application code
that two tabs can race past.
