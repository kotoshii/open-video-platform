## Edit an own comment in place

Needs: [Task-01 — comment-api: Implement PUT /comments/{commentId}](../backend/Task-01-comment-api-Implement-PUT-comments-commentId.md),
[US-Comments-01 Task-05 — Show a comment](../../US-Comments-01/frontend/Task-05-Show-a-comment.md)

Add the 3-dot menu to the acting channel's own comments and replies — on hover on desktop, always visible on mobile —
with "Edit" and "Delete".

Main flow:

1. "Edit" turns the text into an editable box with "Save" and "Cancel".
2. Saving shows the new text, marked as edited, in the same place with the same likes and dislikes.

Branch — the user cancels:

1. The text stays as it was.

Branch — the text is emptied:

1. Nothing is saved; an empty comment cannot be left behind.

Why: hiding the menu is not what protects a comment — the server checks the author on every edit and delete.
