## comment-rate-api: Return the channel's rates for comments

Needs: [Task-04 — comment-rate-api: Implement POST /comment-rates/{commentId}](Task-04-comment-rate-api-Implement-POST-comment-rates-commentId.md)

Add the gRPC method that takes a channel and a list of comment ids and returns that channel's rates on them.
`comment-api` calls it once per page of comments or replies.

Why: one call per page rather than one per comment, and the state comes from the rate rows rather than the counters —
which is what keeps the filled button right while the totals are still catching up.
