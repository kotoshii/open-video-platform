## comment-api: Implement DELETE /comments/{commentId}

Needs: [Task-01 — comment-api: Implement PUT /comments/{commentId}](Task-01-comment-api-Implement-PUT-comments-commentId.md)

`DELETE /comments/{commentId}`

Main flow:

1. Check the comment belongs to the acting channel.
2. In one transaction, delete it — together with its replies when it is a top-level comment — and write the deleted
   events to the outbox.
3. The video's comment count goes down by one plus the number of replies removed; a deleted reply also lowers its
   parent's reply count; the rates on everything removed are deleted by the service that owns them.

Why: comments are hard deleted, with no "[deleted]" placeholder — nothing on the platform is deleted to a hidden state,
and a comment has no window at all, so there is nothing a tombstone would serve. Deleting a top-level comment takes its
replies in one statement rather than a walk down a tree, because there is only one level.
