## notification-api: Implement GET /notifications/unread-count

Needs: [US-Notifications-01 Task-01 — Create notification-api](../../US-Notifications-01/backend/Task-01-Create-notification-api.md)

`GET /notifications/unread-count`

Count the acting channel's unread notifications — rows, not events: one aggregated notification about 47 subscribers
counts as one.

Why: it runs on every page load, so give it an index on the channel where `read_at` is null — the same condition as
the partial unique index, and just as small.
