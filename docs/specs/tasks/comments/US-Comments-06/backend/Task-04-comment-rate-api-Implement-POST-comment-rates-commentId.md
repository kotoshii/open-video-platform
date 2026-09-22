## comment-rate-api: Implement POST /comment-rates/{commentId}

Needs: [Task-01 — Migrate comment-rate-api to the new structure](Task-01-Migrate-comment-rate-api-to-the-new-structure.md),
[Task-03 — comment-api: Expose a comment's existence over gRPC](Task-03-comment-api-Expose-a-comments-existence-over-gRPC.md)

`POST /comment-rates/{commentId}` — body `{ "type": "like" | "dislike" }`

Main flow:

1. Take the acting channel from the `Channel-ID` header.
2. Ask `comment-api` over gRPC whether the comment exists.
3. In one transaction, upsert the rate — unique on the channel and the comment — and write the rate event to the
   outbox.

Branch — the comment does not exist:

1. 404 with its code.

Why: one account can rate the same comment differently from each of its channels, because the rater is the acting
channel rather than the account.
