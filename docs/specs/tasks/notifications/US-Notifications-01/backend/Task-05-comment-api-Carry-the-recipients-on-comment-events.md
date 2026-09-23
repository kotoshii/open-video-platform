## comment-api: Carry the recipients on comment events

Needs: [US-Comments-04 Task-01 — comment-api: Implement POST /comments/{commentId}/replies](../../../comments/US-Comments-04/backend/Task-01-comment-api-Implement-POST-comments-commentId-replies.md),
[US-Comments-05 Task-02 — comment-api: Implement DELETE /comments/{commentId}](../../../comments/US-Comments-05/backend/Task-02-comment-api-Implement-DELETE-comments-commentId.md)

Add to `comment-api`'s events what the notification worker needs, so it never has to ask another service while it
handles a batch.

* Comment created: the video's channel and title, from the `video-api` answer the endpoint already gets.
* Reply created: the author of the thread's top-level comment, the mentioned channel if there is one, the replier's
  name and the text.
* Every deleted event — from the delete endpoint, from a video's deletion and from a channel's purge — carries when the
  comment was created.

Why: the worker keys everything on the recipient, and only `comment-api` knows at write time who started the thread and
who was mentioned. The creation time is what lets a deletion lower only the notification that counted the comment
([notification-aggregation.md](../../../../../explainers/notification-aggregation.md), Part 9).
