## Load and collapse replies

Needs: [Task-02 — comment-api: Implement GET /comments/{commentId}/replies](../backend/Task-02-comment-api-Implement-GET-comments-commentId-replies.md),
[US-Comments-01 Task-05 — Show a comment](../../US-Comments-01/frontend/Task-05-Show-a-comment.md)

Main flow:

1. A comment with replies shows a button with how many.
2. Clicking it loads the first page and shows them indented under the comment.
3. "Show more replies" appends the next page, and disappears once the thread is fully loaded.
4. Clicking the expander again hides them.

Branch — the thread is expanded again:

1. The replies already loaded are shown from the page's own state, with no request, and "Show more replies" carries on
   from where it stopped.

Branch — loading fails:

1. The thread shows an error with a retry in place of the replies; the comment and the list around it keep working.

Why: replies are never loaded with the comment list, so a video with long threads still loads its comments in one
request — and collapsing keeps what was fetched, since re-expanding is common and a page reload is what clears it.
