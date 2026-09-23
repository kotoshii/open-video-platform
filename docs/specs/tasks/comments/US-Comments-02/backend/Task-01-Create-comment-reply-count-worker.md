## Create comment-reply-count-worker

Needs: [_platform known-issues Task-02 — Rebuild the count worker base on the inbox](../../../_platform/known-issues/Task-02-Rebuild-the-count-worker-base-on-the-inbox.md)

Create `comment-reply-count-worker` on the count worker base, and wire it into Compose, the migration container for
`comment-api`'s database — where its inbox table lives — and its Kafka topic.

Why: it writes the reply count on the comment row, so it belongs to `comment-api` and uses that service's credentials.
It is the one count worker that does not exist yet, and it follows the same shape as the others rather than a new one.
