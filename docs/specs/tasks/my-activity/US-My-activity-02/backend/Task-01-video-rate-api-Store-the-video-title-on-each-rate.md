## video-rate-api: Store the video title on each rate

Needs: [US-Videos-04 Task-03 — video-rate-api: Implement POST /video-rates/{videoId}](../../../videos/US-Videos-04/backend/Task-03-video-rate-api-Implement-POST-video-rates-videoId.md),
[US-Videos-05 Task-17 — video-api: Implement GET and PUT /videos/{videoId}](../../../videos/US-Videos-05/backend/Task-17-video-api-Implement-GET-and-PUT-videos-videoId.md)

Keep the video's title and the time the rate was last set on each rate row.

* When a rate is set or switched, store the title from `video-api`'s answer, which the endpoint already asks for, and
  move the rated time to now.
* Consume the video-updated event and set the new title on every rate of that video. Deduplicate through the inbox and
  ignore events older than what is stored.

Why: the list is ordered by when each rate was last set, so switching a like to a dislike moves the video to the top.
The title sits next to the rows for the same reason as in the watch history: the search is a substring match in the
same database ([US-My-activity-01](../../../../user-stories/my-activity/US-My-activity-01-Watch-history.md)).
