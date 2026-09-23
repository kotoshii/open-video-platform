## channel-api: Sweep for deletions whose job was lost

Needs: [Task-02 — channel-api: Implement POST /channels/deletion/confirm](Task-02-channel-api-Implement-POST-channels-deletion-confirm.md)

Add a repeatable job that looks for channels whose `deletion_scheduled_at` has passed and whose purge has not started,
and starts it.

Why: Redis can lose its data and take the delayed job with it. Without the sweep the deletion silently never happens
while the user believes their data is gone. A repeatable BullMQ job keeps its schedule in Redis, so it fires once
however many instances of the service are running.
