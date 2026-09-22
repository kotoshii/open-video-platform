## comment-rate-api: Implement DELETE /comment-rates/{commentId}

Needs: [Task-04 — comment-rate-api: Implement POST /comment-rates/{commentId}](Task-04-comment-rate-api-Implement-POST-comment-rates-commentId.md)

`DELETE /comment-rates/{commentId}`

Main flow:

1. In one transaction, delete the acting channel's rate on that comment and write the deleted event to the outbox.

Branch — there is no rate to remove:

1. Answer as a success.

Why: the delete goes through the outbox like the create, so both halves of switching a rate are announced the same way
— today one rolls back on failure and the other ignores it entirely.
