## comment-api: Store the video title on each comment

Needs: [US-Comments-04 Task-01 — comment-api: Implement POST /comments/{commentId}/replies](../../../comments/US-Comments-04/backend/Task-01-comment-api-Implement-POST-comments-commentId-replies.md),
[US-Videos-05 Task-17 — video-api: Implement PUT /videos/{videoId}](../../../videos/US-Videos-05/backend/Task-17-video-api-Implement-PUT-videos-videoId.md)

Keep the video's title on each comment and reply.

* A new comment stores the title from `video-api`'s answer, which the endpoint already asks for; a reply copies it from
  its parent.
* Consume the video-updated event and set the new title on every comment of that video. Deduplicate through the inbox
  and ignore events older than what is stored.

Why: the My comments search matches the comment text or the video's title, and both have to be in this database for a
substring match — the same copy `comment-api` already keeps of its authors' names and avatars
([US-Comments-01](../../../../user-stories/comments/US-Comments-01-See-comments.md)).
