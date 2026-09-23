## subscription-api: Keep the subscribed channels' details fresh

Needs: [US-Subscriptions-01 Task-06 — subscriber-count-worker: Apply and publish the counts](../../US-Subscriptions-01/backend/Task-06-subscriber-count-worker-Apply-and-publish-the-counts.md)

Store what the subscriptions list renders on the subscription row — the subscribed channel's name, avatar and
description — and refresh them from the channel-updated event. Keep its subscriber count there too, from the count
events.

Deduplicate through the inbox and ignore events older than what is stored.

Why: the list is deliberately unpaginated, so asking `channel-api` for the details of every subscribed channel on each
request would mean one call carrying hundreds of ids. The copy is the same trade-off comments and search already make.
