## Seed rates, subscriptions and views

Needs: [Task-05 — Seed comments and replies](Task-05-Seed-comments-and-replies.md),
[US-Videos-04 Task-03 — video-rate-api: Implement POST /video-rates/{videoId}](../../videos/US-Videos-04/backend/Task-03-video-rate-api-Implement-POST-video-rates-videoId.md),
[US-Comments-06 Task-04 — comment-rate-api: Implement POST /comment-rates/{commentId}](../../comments/US-Comments-06/backend/Task-04-comment-rate-api-Implement-POST-comment-rates-commentId.md),
[US-Subscriptions-01 Task-03 — subscription-api: Implement POST /subscriptions](../../subscriptions/US-Subscriptions-01/backend/Task-03-subscription-api-Implement-POST-subscriptions.md),
[US-Videos-01 Task-01 — video-api: Implement GET /videos/{videoId}/watch](../../videos/US-Videos-01/backend/Task-01-video-api-Implement-GET-videos-videoId-watch.md)

From random channels, like and dislike videos and comments, subscribe to other channels, and open videos through the
watch endpoint to register views and watch history.

Why: this is the interaction data the counters and the feed need; without it the recommender has nothing to learn from
([US-Recommendations-01](../../../user-stories/recommendations/US-Recommendations-01-Feed.md)).
