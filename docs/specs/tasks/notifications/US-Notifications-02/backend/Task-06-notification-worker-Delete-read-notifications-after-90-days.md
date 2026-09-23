## notification-worker: Delete read notifications after 90 days

Needs: [US-Notifications-01 Task-02 — Create notification-worker](../../US-Notifications-01/backend/Task-02-Create-notification-worker.md)

Add a daily BullMQ repeatable job that deletes the notifications read more than 90 days ago, a batch at a time. Unread
notifications are never deleted by it.

Why: a repeatable job fires once per schedule however many worker instances run
([scaling-to-multiple-instances.md](../../../../../explainers/scaling-to-multiple-instances.md)); a timer inside each
instance would fire once per instance. Without the job the table only ever grows.
