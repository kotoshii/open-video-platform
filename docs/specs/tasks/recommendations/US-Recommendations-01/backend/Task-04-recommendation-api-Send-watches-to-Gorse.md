## recommendation-api: Send watches to Gorse

Needs: [Task-03 — recommendation-api: Keep Gorse's items in step with videos](Task-03-recommendation-api-Keep-Gorses-items-in-step-with-videos.md),
[US-Videos-01 Task-01 — video-api: Implement GET /videos/{videoId}/watch](../../../videos/US-Videos-01/backend/Task-01-video-api-Implement-GET-videos-videoId-watch.md)

Consume the viewed event the watch endpoint emits and write `watch` feedback for the acting channel and the video, at
the event's time. A repeat watch writes the same feedback again. Deduplicate through the inbox.

Use every viewed event, not the deduplicated view count. Skipping a channel whose history is paused comes with
[US-My-activity-01](../../../../user-stories/my-activity/US-My-activity-01-Watch-history.md).

Why: Gorse creates the user with its first feedback, so a new channel needs no setup here. Until it watches something
it has no history at all, which is the cold start the popularity fallback covers.
