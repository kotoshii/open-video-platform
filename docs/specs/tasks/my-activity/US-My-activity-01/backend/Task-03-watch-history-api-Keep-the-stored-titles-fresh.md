## watch-history-api: Keep the stored titles fresh

Needs: [Task-01 — Create watch-history-api](Task-01-Create-watch-history-api.md),
[US-Videos-05 Task-17 — video-api: Implement PUT /videos/{videoId}](../../../videos/US-Videos-05/backend/Task-17-video-api-Implement-PUT-videos-videoId.md)

Consume the video-updated event and set the new title on every history row of that video. Deduplicate through the inbox
and ignore events older than what is stored.

Consume the video deleted event too, and clear the title on that video's rows. The rows stay, as "Deleted video"
placeholders, but nothing of the deleted video is kept. A channel's purge publishes a deleted event per video, so this
covers it as well.

Why: the search is a plain substring match in Postgres, so the title has to sit next to the rows it filters. Filtering
by channel first keeps the scan small; a `pg_trgm` index is the next step if it ever is not.
