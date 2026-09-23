## recommendation-api: Send likes and dislikes to Gorse

Needs: [Task-03 — recommendation-api: Keep Gorse's items in step with videos](Task-03-recommendation-api-Keep-Gorses-items-in-step-with-videos.md),
[US-Videos-04 Task-04 — video-rate-api: Implement DELETE /video-rates/{videoId}](../../../videos/US-Videos-04/backend/Task-04-video-rate-api-Implement-DELETE-video-rates-videoId.md)

Consume the video rate events. Deduplicate through the inbox.

Main flow — a like:

1. Write `like` feedback for the channel and the video, and delete its `dislike` feedback if there is one.

Main flow — a dislike:

1. The same the other way round.

Main flow — the rate is removed:

1. Delete both.

Why: a dislike is negative feedback, which Gorse weighs above everything else — the video is not recommended to that
channel again, and videos like it rank lower. A switch from like to dislike has to remove the like, or the item would
carry both signals at once.
