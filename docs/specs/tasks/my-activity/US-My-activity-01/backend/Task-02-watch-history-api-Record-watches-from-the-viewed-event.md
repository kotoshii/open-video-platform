## watch-history-api: Record watches from the viewed event

Needs: [Task-01 — Create watch-history-api](Task-01-Create-watch-history-api.md),
[US-Videos-01 Task-01 — video-api: Implement GET /videos/{videoId}/watch](../../../videos/US-Videos-01/backend/Task-01-video-api-Implement-GET-videos-videoId-watch.md)

Consume the viewed events in batches: upsert the row for the acting channel and the video, moving the watched time
forward only, and store the title the event carries. Deduplicate through the inbox, and read the paused flags and
clear times for all the batch's channels in one query.

Branch — the channel's history is paused:

1. Skip the event. The view is still counted, because the count worker consumes the same event on its own.

Branch — the watch happened before the channel's last clear:

1. Skip it, or a watch still in flight when the user cleared would bring its row back.

Why: the history is written from every watch event, not from the deduplicated view count — a second watch within the
day does not count as a view, but it must still move the video to the top. The time only moves forward, so a late or
redelivered event never pushes a row down.
