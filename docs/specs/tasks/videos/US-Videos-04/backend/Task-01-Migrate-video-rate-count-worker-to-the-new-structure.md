## Migrate video-rate-count-worker to the new structure

Needs: [_platform known-issues Task-02 — Rebuild the count worker base on the inbox](../../../_platform/known-issues/Task-02-Rebuild-the-count-worker-base-on-the-inbox.md)

Move `video-rate-count-worker` to the new layout, onto the rebuilt count worker base, and wire it into Compose, the
migration container for `video-api`'s database and its Kafka topic.

Why: it writes the like and dislike counts on the video row, so it belongs to `video-api` and uses that service's
credentials.
