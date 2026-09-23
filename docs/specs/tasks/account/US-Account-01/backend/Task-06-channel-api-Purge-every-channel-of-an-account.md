## channel-api: Purge every channel of an account

Needs: [US-Channels-06 Task-07 — channel-api: Run the purge as a saga](../../../channels/US-Channels-06/backend/Task-07-channel-api-Run-the-purge-as-a-saga.md)

Consume the account purge event: run the channel purge for every channel of the account, and publish an event telling
`account-api` once all of them have finished.

Branch — a channel's own purge is already running, or done:

1. Count it rather than start another; every step is idempotent.

Branch — the event arrives again:

1. Answer from the state already recorded, and report again if everything has finished.

Why: account deletion is channel deletion fanned out over the account's channels, plus the account itself. Reusing the
channel purge — its videos, comments, rates, subscriptions and the rest — keeps the list of what a channel leaves behind
in one place ([US-Channels-06](../../../../user-stories/channels/US-Channels-06-delete-own-channel.md)).
