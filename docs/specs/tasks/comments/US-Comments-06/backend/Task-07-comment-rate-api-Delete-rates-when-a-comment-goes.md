## comment-rate-api: Delete rates when a comment goes

Needs: [Task-04 — comment-rate-api: Implement POST /comment-rates/{commentId}](Task-04-comment-rate-api-Implement-POST-comment-rates-commentId.md),
[US-Comments-05 Task-02 — comment-api: Implement DELETE /comments/{commentId}](../../US-Comments-05/backend/Task-02-comment-api-Implement-DELETE-comments-commentId.md)

Consume the comment-deleted events and delete the rates on those comments.

This is the one consumer behind every way a comment disappears: the author deleting it, a video being deleted
([US-Videos-03](../../../../user-stories/videos/US-Videos-03-Manage-own-videos.md)), or a channel being purged
([US-Channels-06](../../../../user-stories/channels/US-Channels-06-delete-own-channel.md)).

Why: no decrement event is published for these, because the comment they counted towards is gone with them — unlike a
channel purge, where the rates it gave to comments that still exist do have to be counted down.
