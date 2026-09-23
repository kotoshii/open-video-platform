## video-rate-api: Delete a video's rates on deletion

Needs: [Task-02 — Migrate video-rate-api to the new structure](Task-02-Migrate-video-rate-api-to-the-new-structure.md),
[Task-04 — video-api: Implement DELETE /videos/{videoId}](Task-04-video-api-Implement-DELETE-videos-videoId.md)

Consume the video-deleted event: delete every rate on that video and report nothing further — the video's own counters
go with it.

Why: rates are destroyed with the video, so the entry simply leaves a channel's rated videos list
([US-My-activity-02](../../../../user-stories/my-activity/US-My-activity-02-Rated-videos.md)) — unlike watch history,
where the row stays as a placeholder.
