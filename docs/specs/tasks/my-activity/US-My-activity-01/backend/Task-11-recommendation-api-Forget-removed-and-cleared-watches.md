## recommendation-api: Forget removed and cleared watches

Needs: [Task-06 — watch-history-api: Implement DELETE /watch-history/{videoId}](Task-06-watch-history-api-Implement-DELETE-watch-history-videoId.md),
[Task-07 — watch-history-api: Implement DELETE /watch-history](Task-07-watch-history-api-Implement-DELETE-watch-history.md),
[US-Recommendations-01 Task-04 — recommendation-api: Send watches to Gorse](../../../recommendations/US-Recommendations-01/backend/Task-04-recommendation-api-Send-watches-to-Gorse.md)

Consume the history-entry-removed and history-cleared events. Deduplicate through the inbox.

Main flow — one video removed:

1. Delete the channel's `watch` feedback for that video.

Main flow — history cleared:

1. Delete all the channel's `watch` feedback, and store the clear time.
2. From then on, the watch consumer skips watch events older than that time, for the same reason the history does.

Likes and dislikes stay: clearing the history is about what the channel watched.

Why: the feed changes once Gorse next refreshes its models, not straight away — deleting the feedback removes the
signal, and the recommendations built from it age out on their own.
