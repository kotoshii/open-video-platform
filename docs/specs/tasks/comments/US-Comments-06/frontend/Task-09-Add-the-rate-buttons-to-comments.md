## Add the rate buttons to comments

Needs: [Task-04 — comment-rate-api: Implement POST /comment-rates/{commentId}](../backend/Task-04-comment-rate-api-Implement-POST-comment-rates-commentId.md),
[Task-05 — comment-rate-api: Implement DELETE /comment-rates/{commentId}](../backend/Task-05-comment-rate-api-Implement-DELETE-comment-rates-commentId.md),
[US-Comments-01 Task-05 — Show a comment](../../US-Comments-01/frontend/Task-05-Show-a-comment.md)

Add the like and dislike buttons to every comment and reply, each with its count, filled in from the rate the list
already returned.

Main flow:

1. Clicking an inactive button activates it straight away, before the server answers.
2. Clicking the active one removes the rate; clicking the opposite one moves it.

Branch — a count is zero:

1. No number is shown next to that button.

Branch — the request fails:

1. The button goes back to what it was, and a toast says what went wrong.

Why: the counts are never adjusted on the client, exactly as on the video page — the filled button is what confirms the
click, and hiding a zero removes the one case that would look broken.
