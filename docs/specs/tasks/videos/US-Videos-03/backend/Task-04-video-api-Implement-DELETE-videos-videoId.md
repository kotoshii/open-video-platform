## video-api: Implement DELETE /videos/{videoId}

Needs: [US-Videos-05 Task-19 — video-api: Implement POST /videos/{videoId}/publish](../../US-Videos-05/backend/Task-19-video-api-Implement-POST-videos-videoId-publish.md)

`DELETE /videos/{videoId}`

Main flow:

1. Check the video belongs to the acting channel.
2. Delete the row and write the video-deleted event to the outbox, in one transaction.
3. Schedule a background job that removes the video's whole prefix from the bucket.

Every service that owns something about the video reacts to that event: the comments and their rates, the video's
rates, the search document and the recommender's item —
and `video-upload-api` drops the video's upload session if one is still open.

Branch — the video is still uploading or processing:

1. Delete it anyway, and let the processing jobs for it fail or be cancelled.

Why: deleting one video is immediate and final — the 10-second confirmation is the whole guard, because a window
belongs to deleting a channel, where one action takes everything at once. The files go in the background so the row and
the listings can go at once.
