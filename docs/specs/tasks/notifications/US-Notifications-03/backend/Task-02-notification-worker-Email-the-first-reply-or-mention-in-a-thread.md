## notification-worker: Email the first reply or mention in a thread

Needs: [Task-01 — email-worker: Add the reply and mention templates](Task-01-email-worker-Add-the-reply-and-mention-templates.md),
[US-Notifications-01 Task-08 — notification-worker: Create reply and mention notifications](../../US-Notifications-01/backend/Task-08-notification-worker-Create-reply-and-mention-notifications.md),
[US-Comments-03 Task-02 — channel-api: Look up channels by id over gRPC](../../../comments/US-Comments-03/backend/Task-02-channel-api-Look-up-channels-by-id-over-gRPC.md)

When a reply or a mention reaches a channel with email turned on for that type, send it or gather it. This follows the
email toggle alone: it happens even when the in-app one is off.

Main flow:

1. Open the window for the recipient and the thread with an atomic set-if-absent in Redis, expiring in 15 minutes.
2. If it opened, ask `channel-api` for the recipient channel's name and account, publish the send-email event now, and
   schedule a BullMQ delayed flush job for the end of the window.
3. If it was already open, store the reply as a pending item for that recipient and thread, and send nothing.

Branch — the reply is the recipient's own:

1. Nothing, the same as in-app.

Why: set-if-absent is what makes "the first in the thread" safe with several instances — two replies handled at the same
moment cannot both be first. The pending items live in Postgres rather than in the job's data, so a comment deleted
while it waits can be removed from them.
