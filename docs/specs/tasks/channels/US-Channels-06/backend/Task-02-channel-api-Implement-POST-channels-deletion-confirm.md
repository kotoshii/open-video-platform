## channel-api: Implement POST /channels/deletion/confirm

Needs: [Task-01 — channel-api: Implement POST /channels/current/deletion](Task-01-channel-api-Implement-POST-channels-current-deletion.md),
[_platform foundation Task-06 — Add Redis and BullMQ builders to lib](../../../_platform/foundation/Task-06-Add-Redis-and-BullMQ-builders-to-lib.md)

`POST /channels/deletion/confirm` — body `{ token }`

Main flow:

1. Consume the token from Redis, so the link works once.
2. Set `deletion_scheduled_at` on the channel a week ahead and store a cancel token with it.
3. Write the deletion-scheduled event to the outbox in the same transaction.
4. Schedule the delayed BullMQ job that will run the purge.
5. Publish the second email: the date, and a link that cancels the deletion.

Branch — the token is unknown or expired:

1. Return its code. The page says so and deliberately offers no resend.

The route is public at the gateway, since the link may be opened in a browser nobody is signed in on.

Why: the column is the source of truth and the job is only a trigger — a week is a long time for the only record of a
deletion to live in Redis. The cancel token lives with the row for the same reason: it has to survive until the deletion
runs.
