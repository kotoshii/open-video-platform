## subscription-api: Delete a channel's subscriptions on purge

Needs: [Task-07 — channel-api: Run the purge as a saga](Task-07-channel-api-Run-the-purge-as-a-saga.md),
[US-Subscriptions-01 Task-04 — subscription-api: Implement DELETE /subscriptions/{channelId}](../../../subscriptions/US-Subscriptions-01/backend/Task-04-subscription-api-Implement-DELETE-subscriptions-channelId.md)

Consume the purge event: delete the channel's subscriptions in both directions — the channels it followed and the ones
that followed it — writing an unsubscribe event for each, carrying the subscription's original creation time, then
report back.

Why: that creation time is what lets an open "new subscribers" notification lower only the count it actually counted
([US-Notifications-01](../../../../user-stories/notifications/US-Notifications-01-Notifications-config.md)). Without it
an unsubscribe can pull down a number it was never part of.
