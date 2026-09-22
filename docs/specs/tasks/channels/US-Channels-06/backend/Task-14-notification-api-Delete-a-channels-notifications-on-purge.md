## notification-api: Delete a channel's notifications on purge

Needs: [Task-07 — channel-api: Run the purge as a saga](Task-07-channel-api-Run-the-purge-as-a-saga.md)

Consume the purge event: delete the notifications the channel received and its notification preferences, then report
back.

Why: a comment preview inside a notification is a copy of somebody else's comment, so the notifications go with the
channel that received them rather than with the comments they quote.
