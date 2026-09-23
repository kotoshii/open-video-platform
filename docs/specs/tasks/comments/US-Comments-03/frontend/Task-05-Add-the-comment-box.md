## Add the comment box

Needs: [Task-03 — comment-api: Implement POST /comments/{videoId}](../backend/Task-03-comment-api-Implement-POST-comments-videoId.md),
[US-Comments-01 Task-04 — Build the comments section](../../US-Comments-01/frontend/Task-04-Build-the-comments-section.md)

Add the box at the top of the section, showing the acting channel's avatar and the placeholder "Leave a comment...",
with a "Comment" button — an arrow button on mobile.

Main flow:

1. User types and posts.
2. The new comment appears at the top of the list, the header's total goes up, and the box is cleared.

Branch — the text is empty:

1. Nothing is sent.

Branch — the text passes 5000 characters:

1. The form stops at the limit.

Branch — posting fails:

1. A toast explains it and the typed text stays in the box.

Why: the comment is rendered from the response rather than by reloading the list, so it does not depend on where the
current sort order would put it.
