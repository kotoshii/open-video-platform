## comment-api: Expose a comment's existence over gRPC

Needs: [US-Comments-01 Task-01 — comment-api: Implement GET /comments](../../US-Comments-01/backend/Task-01-comment-api-Implement-GET-comments.md)

Add the gRPC method that answers whether a comment exists and which video it belongs to. `comment-rate-api` calls it
before storing a rate.

Why: a rate on a comment that is already gone would be counted against a row that no longer exists, and the rate rows
live in a different service's database — so the question has to be asked rather than joined.
