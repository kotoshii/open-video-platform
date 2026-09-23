## Delete a comment from the list

Needs: [Task-03 — Build the My comments page](Task-03-Build-the-My-comments-page.md),
[US-Comments-05 Task-02 — comment-api: Implement DELETE /comments/{commentId}](../../../comments/US-Comments-05/backend/Task-02-comment-api-Implement-DELETE-comments-commentId.md)

Add the delete button to each item — on hover on desktop, always visible on mobile.

Main flow:

1. Clicking it opens a confirmation modal. For a top-level comment with replies, it says the replies are deleted too.
2. On confirm, delete the comment and load the list again.

Branch — the user cancels:

1. The modal closes and nothing changes.

Branch — the request fails:

1. A toast, and the comment stays.

Why: this is the same delete as in the comments section, so the counts are corrected by their workers and nothing on
this page adjusts them. The list comes with each top-level comment's reply count, which is what decides the modal's
text.
