## notification-worker: Count new subscribers

Needs: [Task-02 — Create notification-worker](Task-02-Create-notification-worker.md),
[US-Subscriptions-01 Task-04 — subscription-api: Implement DELETE /subscriptions/{channelId}](../../../subscriptions/US-Subscriptions-01/backend/Task-04-subscription-api-Implement-DELETE-subscriptions-channelId.md)

Consume the subscription created and deleted events.

Main flow — created:

1. Skip the events for channels that have New subscribers turned off in-app.
2. Upsert each subscribed channel's open notification: add to the count, keep the earliest `first_event_at`, and move
   `activity_at` to the latest event time. `ON CONFLICT` has to repeat the partial index's `WHERE`, or Postgres cannot
   match the index.

Main flow — deleted:

1. Lower the open notification by the removals whose subscription was created at or after its `first_event_at`.
2. Delete it if the count reaches zero.

Add unit tests if the logic turns out complex.

Why: both sides of the comparison are event times, never the moment the batch was processed — otherwise removing the
very subscriber that opened the notification would fail the check. A removal counted in an older notification the user
has already read changes nothing ([notification-aggregation.md](../../../../../explainers/notification-aggregation.md),
Part 9).
