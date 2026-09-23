## Open a linked comment thread

Needs: [Task-02 — comment-api: Implement GET /comments/{commentId}/thread](../backend/Task-02-comment-api-Implement-GET-comments-commentId-thread.md),
[Task-05 — Show a comment](Task-05-Show-a-comment.md)

When the video page is opened with `?comment=<id>`, show that comment's thread above the normal list — the top-level
comment and its replies — with the linked one highlighted, whether it is the comment or one of its replies.

Branch — the linked comment no longer exists:

1. A short note in its place, and the list loads as usual. This is not an error state.

Why: the rest of the list loads underneath as normal, so a link into one conversation does not turn the page into
something different.
