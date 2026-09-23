## recommendation-api: Skip watches of paused channels

Needs: [Task-09 — watch-history-api: Expose the paused flag over gRPC](Task-09-watch-history-api-Expose-the-paused-flag-over-gRPC.md),
[US-Recommendations-01 Task-04 — recommendation-api: Send watches to Gorse](../../../recommendations/US-Recommendations-01/backend/Task-04-recommendation-api-Send-watches-to-Gorse.md)

In the watch consumer, ask `watch-history-api` which of the batch's channels are paused, cache the answers for a few
seconds, and write no `watch` feedback for those channels.

Branch — `watch-history-api` does not answer:

1. Fail the batch, so Kafka delivers it again. Sending feedback for a channel that may be paused is the one outcome this
   must avoid.

Why: the watch event is still emitted while the history is paused, so views keep being counted. The skipping happens in
the two consumers that record what the channel watched, and nowhere else.
