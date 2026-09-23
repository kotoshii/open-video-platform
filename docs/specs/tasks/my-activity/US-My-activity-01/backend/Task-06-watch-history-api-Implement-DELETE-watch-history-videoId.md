## watch-history-api: Implement DELETE /watch-history/{videoId}

Needs: [Task-01 — Create watch-history-api](Task-01-Create-watch-history-api.md)

`DELETE /watch-history/{videoId}`

Main flow:

1. In one transaction, delete the acting channel's row for the video and write the history-entry-removed event to the
   outbox.

Branch — there is no such row:

1. Answer as a success.

Why: the recommender forgets that watch from the event
([US-Recommendations-01](../../../../user-stories/recommendations/US-Recommendations-01-Feed.md)), so the request never
waits for Gorse.
