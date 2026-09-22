## subscriber-count-worker: Apply and publish the counts

Needs: [Task-02 — Migrate subscriber-count-worker to the new structure](Task-02-Migrate-subscriber-count-worker-to-the-new-structure.md),
[Task-03 — subscription-api: Implement POST /subscriptions](Task-03-subscription-api-Implement-POST-subscriptions.md)

Consume the subscription events in batches: record their ids in the inbox, sum the per-channel deltas in memory, and
apply them to the channels in one statement inside the same transaction. Then publish the new counts, so the services
that keep a copy can follow.

Those copies are the channel document in the search index
([US-Search-02](../../../../user-stories/search/US-Search-02-Search-channels.md)) and the rows the subscriptions list
renders ([US-Subscriptions-03](../../../../user-stories/subscriptions/US-Subscriptions-03-Subscription-content-page.md)).

Why: the worker writes straight into `channel-api`'s database, so that service never learns of the change and cannot
announce it — without this event the search index would order by a number that never moves.
