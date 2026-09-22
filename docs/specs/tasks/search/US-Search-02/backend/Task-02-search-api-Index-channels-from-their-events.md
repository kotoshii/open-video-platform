## search-api: Index channels from their events

Needs: [Task-01 — search-api: Define the channel index](Task-01-search-api-Define-the-channel-index.md),
[US-Subscriptions-01 Task-06 — subscriber-count-worker: Apply and publish the counts](../../../subscriptions/US-Subscriptions-01/backend/Task-06-subscriber-count-worker-Apply-and-publish-the-counts.md)

Consume the channel events: index a channel when it is created, update it when its name, description or avatar
changes, and remove it when it is purged. Keep the subscriber count up to date from the count events
([US-Subscriptions-01](../../../../user-stories/subscriptions/US-Subscriptions-01-Subscribe-to-other-channels.md)).

Deduplicate through the inbox and ignore events older than the stored document.

Why: until subscriptions exist every channel has no subscribers, so the count arrives with its own story and the
ordering by it starts working then.
