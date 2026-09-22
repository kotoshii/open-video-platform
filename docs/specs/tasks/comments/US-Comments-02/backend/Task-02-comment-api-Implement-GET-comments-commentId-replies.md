## comment-api: Implement GET /comments/{commentId}/replies

Needs: [US-Comments-01 Task-01 — comment-api: Implement GET /comments](../../US-Comments-01/backend/Task-01-comment-api-Implement-GET-comments.md)

`GET /comments/{commentId}/replies` — a page of a comment's replies, up to 30, oldest first

Main flow:

1. Page with a keyset cursor on the reply ordering, so replies posted while a thread is open do not shift the pages
   already loaded.
2. Include the acting channel's own rates, as the comment list does.

Why: a thread is one flat list rather than a tree, because there is only one level of nesting — no recursive query, and
the reply count is a single number per comment instead of a subtree size.
