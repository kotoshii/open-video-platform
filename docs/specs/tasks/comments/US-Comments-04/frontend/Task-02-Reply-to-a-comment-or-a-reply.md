## Reply to a comment or a reply

Needs: [Task-01 — comment-api: Implement POST /comments/{commentId}/replies](../backend/Task-01-comment-api-Implement-POST-comments-commentId-replies.md),
[US-Comments-02 Task-04 — Load and collapse replies](../../US-Comments-02/frontend/Task-04-Load-and-collapse-replies.md)

Main flow:

1. "Reply" opens a box under the comment, with the placeholder "Leave a reply...", a "Reply" button and a "Cancel" one
   — an arrow and an × on mobile.
2. Replying to a reply prefills an `@mention` of its author as ordinary text the user can edit or delete.
3. Posting adds the reply to that thread, expanding it if it was collapsed, and the reply count goes up.

Branch — the user cancels:

1. The box closes and the text is discarded.

Branch — posting fails:

1. A toast explains it and the box stays open with the text.

Why: a reply to a reply goes into the same thread rather than under the reply, because there is only one level of
nesting — the mention is what shows who is being answered.
