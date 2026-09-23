## recommendation-api: Send subscriptions to Gorse

Needs: [Task-03 — recommendation-api: Keep Gorse's items in step with videos](Task-03-recommendation-api-Keep-Gorses-items-in-step-with-videos.md),
[US-Subscriptions-01 Task-04 — subscription-api: Implement DELETE /subscriptions/{channelId}](../../../subscriptions/US-Subscriptions-01/backend/Task-04-subscription-api-Implement-DELETE-subscriptions-channelId.md)

Consume the subscription created and deleted events, and keep the subscribed channel ids in the subscriber's Gorse user
labels: add the channel on created, remove it on deleted. Deduplicate through the inbox.

Gorse replaces a user's labels as a whole, so each change is a read-modify-write. That is only safe while one consumer
handles all of a subscriber's events in order, which is why `subscription-api` keys them by the subscriber
([US-Subscriptions-01 Task-03](../../../subscriptions/US-Subscriptions-01/backend/Task-03-subscription-api-Implement-POST-subscriptions.md)).

Why: Gorse feedback links a user to an item, and a channel is not an item. Labels on both sides — the subscriptions on
the user, the channel id on each video — let the ranking model learn that a channel's subscribers like its videos.
