## Create notification-api

Create `notification-api` in the new structure and wire it into Compose, the database init, the migration container,
its Kafka topics and the gateway route.

* Preferences: a row per channel, written only when a user saves.
* Notifications: the recipient channel, the type, the subject — the video for new comments, none for new subscribers —
  the count, `first_event_at`, `activity_at`, `read_at` and `hidden_at`; the video's title for new comments; and for
  replies and mentions the comment, the video, the replier's name and the text.
* The partial unique index from
  [notification-aggregation.md](../../../../../explainers/notification-aggregation.md) (Part 5): one row per channel,
  type and subject while `read_at` is null.

The index needs `NULLS NOT DISTINCT`: subscriber notifications have no subject, and a plain unique index never treats
two nulls as equal, so it would accept any number of open ones.

Why: the database keeps one open notification per key, rather than a look-then-insert in code that two events in one
batch — or two worker instances — can both get past.
