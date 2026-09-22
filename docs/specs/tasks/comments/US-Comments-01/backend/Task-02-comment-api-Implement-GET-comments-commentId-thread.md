## comment-api: Implement GET /comments/{commentId}/thread

Needs: [Task-01 — comment-api: Implement GET /comments](Task-01-comment-api-Implement-GET-comments.md)

`GET /comments/{commentId}/thread` — the thread a link points at: the top-level comment and its replies

Main flow:

1. When the id belongs to a reply, resolve its top-level comment and return that thread.
2. Mark which comment was asked for, so the page can highlight it.

Branch — the comment no longer exists:

1. Say so; the page reports it in a short note and loads the normal list as usual.

The thread is left out of the paginated list, the same way pinned own comments are.

Why: a linked comment can sit hundreds of comments down an infinitely scrolled list, so it is loaded on its own rather
than by scrolling until it appears. Notifications, notification emails and My comments all open the video this way.
