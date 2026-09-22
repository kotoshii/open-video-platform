## comment-api: Implement PUT /comments/{commentId}

Needs: [US-Comments-04 Task-01 — comment-api: Implement POST /comments/{commentId}/replies](../../US-Comments-04/backend/Task-01-comment-api-Implement-POST-comments-commentId-replies.md)

`PUT /comments/{commentId}` — body `{ text }`

Main flow:

1. Check the comment belongs to the acting channel.
2. Save the text and mark the comment as edited.

Branch — the text is empty or over 5000 characters:

1. A field-level error; nothing is saved.

Branch — it is somebody else's comment:

1. 404, the same answer as a comment that does not exist.

Why: the row stays the same, so the comment keeps its id, its rates and its place in the thread — only the text and the
edited flag change, and no event is needed because nothing else stores the text.
