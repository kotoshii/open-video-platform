## video-api: Delete a channel's videos on purge

Needs: [Task-07 — channel-api: Run the purge as a saga](Task-07-channel-api-Run-the-purge-as-a-saga.md),
[US-Videos-03 Task-04 — video-api: Implement DELETE /videos/{videoId}](../../../videos/US-Videos-03/backend/Task-04-video-api-Implement-DELETE-videos-videoId.md)

Consume the purge event: delete the channel's videos and report back.

Main flow:

1. Delete the rows, and publish a deleted event per video so the services that keep copies of them follow.
2. Hand the files to a background job, which removes each video's whole prefix from the bucket.
3. Publish this service's "purged" event.

Why: the rows and the listings go immediately while the bytes follow, because a channel with many videos would
otherwise hold the purge open for as long as the deletes take.
