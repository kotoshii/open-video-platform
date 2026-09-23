## Migrate subscriber-count-worker to the new structure

Needs: [_platform known-issues Task-02 — Rebuild the count worker base on the inbox](../../../_platform/known-issues/Task-02-Rebuild-the-count-worker-base-on-the-inbox.md)

Move `subscriber-count-worker` to the new layout, onto the rebuilt count worker base, and wire it into Compose, the
migration container for `channel-api`'s database and its Kafka topic.

Why: it writes the subscriber count on the channel row, so it belongs to `channel-api` and uses that service's
credentials — it consumes `subscription-api`'s events without touching its database.
