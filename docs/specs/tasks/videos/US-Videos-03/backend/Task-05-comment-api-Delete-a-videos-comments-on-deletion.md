## comment-api: Delete a video's comments on deletion

Needs: [Task-01 — Migrate comment-api to the new structure](Task-01-Migrate-comment-api-to-the-new-structure.md),
[Task-04 — video-api: Implement DELETE /videos/{videoId}](Task-04-video-api-Implement-DELETE-videos-videoId.md)

Consume the video-deleted event: delete every comment and reply on that video, writing the comment-deleted events to the
outbox so the rates on them follow
([US-Comments-06](../../../../user-stories/comments/US-Comments-06-Like-dislike-comments.md)).

Why: the comment rows live here and the rates on them live in another service, so this task deletes what it owns and
announces the rest rather than reaching across the boundary.
