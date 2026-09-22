## Delete an own comment or reply

Needs: [Task-02 — comment-api: Implement DELETE /comments/{commentId}](../backend/Task-02-comment-api-Implement-DELETE-comments-commentId.md),
[Task-03 — Edit an own comment in place](Task-03-Edit-an-own-comment-in-place.md)

Main flow:

1. "Delete" opens a confirmation.
2. Confirming removes the comment from the list, and the counts around it go down.

Branch — the comment is a top-level one with replies:

1. The confirmation says the replies go with it.

Branch — the request fails:

1. A toast explains it and the comment stays exactly as it was.

Why: the counts shown next to it come from workers, so they catch up a moment later — the row disappearing is what
confirms the deletion.
