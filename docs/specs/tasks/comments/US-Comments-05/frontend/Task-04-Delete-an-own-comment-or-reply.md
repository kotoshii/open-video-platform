## Delete an own comment or reply

Needs: [Task-02 — comment-api: Implement DELETE /comments/{commentId}](../backend/Task-02-comment-api-Implement-DELETE-comments-commentId.md),
[Task-03 — Edit an own comment in place](Task-03-Edit-an-own-comment-in-place.md)

Main flow:

1. "Delete" opens a confirmation.
2. Confirming removes the comment from the list, and lowers the counts shown on the page straight away: the video's
   total by the comment plus its replies, and the parent's reply count when it is a reply.

Branch — the comment is a top-level one with replies:

1. The confirmation says the replies go with it.

Branch — the request fails:

1. A toast explains it and the comment stays exactly as it was.

Why: the stored counts come from workers and catch up a moment later, so the page adjusts its own copy, the same way
posting a comment raises it. A reload shows whatever the workers have applied by then.
