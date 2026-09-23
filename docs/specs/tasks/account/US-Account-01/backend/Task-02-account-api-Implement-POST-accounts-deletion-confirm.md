## account-api: Implement POST /accounts/deletion/confirm

Needs: [Task-01 — account-api: Implement POST /accounts/current/deletion](Task-01-account-api-Implement-POST-accounts-current-deletion.md),
[_platform foundation Task-06 — Add Redis and BullMQ builders to lib](../../../_platform/foundation/Task-06-Add-Redis-and-BullMQ-builders-to-lib.md)

`POST /accounts/deletion/confirm` — body `{ token }`

Main flow:

1. Check the token belongs to the account in `User-ID`, then consume it from Redis, so the link works once.
2. Set `deletion_scheduled_at` on the account a week ahead, store a cancel token with it, and write the
   deletion-scheduled event to the outbox in the same transaction.
3. Schedule the delayed BullMQ job that will run the purge.
4. Publish the second email: the date, and a link that cancels the deletion until it runs.

`GET /accounts/current` returns the scheduled time from now on.

Branch — the token is unknown or expired:

1. Return its code. The page says so and offers no resend.

The route needs a session; a browser without one is sent to log in and back to the link
([US-Auth-04](../../../../user-stories/auth/US-Auth-04-Session-persistence.md)). A token for another account is refused
with its code.

Why: the same shape as a channel's deletion
([US-Channels-06 Task-02](../../../channels/US-Channels-06/backend/Task-02-channel-api-Implement-POST-channels-deletion-confirm.md)):
the column is the source of truth and the job only a trigger, and the cancel token lives with the row because it has to
last the whole week.
