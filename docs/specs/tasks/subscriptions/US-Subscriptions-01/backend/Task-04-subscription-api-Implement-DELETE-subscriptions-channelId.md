## subscription-api: Implement DELETE /subscriptions/{channelId}

Needs: [Task-03 — subscription-api: Implement POST /subscriptions](Task-03-subscription-api-Implement-POST-subscriptions.md)

`DELETE /subscriptions/{channelId}`

Main flow:

1. In one transaction, delete the pair and write the subscription-deleted event to the outbox, carrying **when the
   subscription was originally created**.

Branch — there is no subscription:

1. Answer as a success.

Why: that creation time is what lets an open "new subscribers" notification lower only the count it actually counted
([US-Notifications-01](../../../../user-stories/notifications/US-Notifications-01-Notifications-config.md)). Without
it, someone who subscribed last week and leaves today would pull down a number they were never part of.
