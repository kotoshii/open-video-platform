## account-api: Collect the account's data into an archive

Needs: [Task-02 — channel-api: Export an account's channels over gRPC](Task-02-channel-api-Export-an-accounts-channels-over-gRPC.md),
[Task-03 — video-api: Export channels' videos over gRPC](Task-03-video-api-Export-channels-videos-over-gRPC.md),
[Task-04 — comment-api: Export channels' comments over gRPC](Task-04-comment-api-Export-channels-comments-over-gRPC.md),
[Task-05 — video-rate-api: Export channels' video rates over gRPC](Task-05-video-rate-api-Export-channels-video-rates-over-gRPC.md),
[Task-06 — comment-rate-api: Export channels' comment rates over gRPC](Task-06-comment-rate-api-Export-channels-comment-rates-over-gRPC.md),
[Task-07 — subscription-api: Export channels' subscriptions over gRPC](Task-07-subscription-api-Export-channels-subscriptions-over-gRPC.md),
[Task-08 — watch-history-api: Export channels' watch history over gRPC](Task-08-watch-history-api-Export-channels-watch-history-over-gRPC.md),
[Task-09 — notification-api: Export channels' notification preferences over gRPC](Task-09-notification-api-Export-channels-notification-preferences-over-gRPC.md)

Build the archive in memory from every service that owns some of the account's data.

Main flow:

1. Ask `channel-api` for the account's channels.
2. With their ids, ask every other service at once, in parallel.
3. Add the account record itself, write one JSON file per kind of data — the account, channels, videos, comments,
   video rates, comment rates, subscriptions, watch history and notification preferences — and zip them.

Branch — any service fails or times out:

1. The whole collection fails. Nothing is stored.

Keep the list of services the export asks next to the list the channel purge waits for, in one place in `lib`. They
differ on purpose — the search index and Gorse hold only copies, so they are purged but not exported, and `channel-api`
is exported per account but runs the purge rather than taking part in it — and keeping them side by side is what makes
a service added to one visibly missing from the other
([US-Channels-06 Task-07](../../../channels/US-Channels-06/backend/Task-07-channel-api-Run-the-purge-as-a-saga.md)), so
a service added to one cannot be forgotten in the other.

Why: this is a synchronous fan-out over gRPC, not Kafka — the user is waiting for the answer, and Kafka has no way to
bring responses back into the request that asked. A partial archive would look complete while quietly leaving data out,
which is why one failure fails the lot.
