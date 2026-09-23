## notification-api: Delete a channel's notifications on purge

Needs: [Task-07 — channel-api: Run the purge as a saga](Task-07-channel-api-Run-the-purge-as-a-saga.md),
[US-Notifications-01 Task-01 — Create notification-api](../../../notifications/US-Notifications-01/backend/Task-01-Create-notification-api.md)

Consume the purge event: delete the notifications the channel received and its notification preferences, then report
back.

Why: a comment preview inside a notification is a copy of somebody else's comment, so the notifications go with the
channel that received them rather than with the comments they quote.
