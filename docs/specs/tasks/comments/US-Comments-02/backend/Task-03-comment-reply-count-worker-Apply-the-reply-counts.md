## comment-reply-count-worker: Apply the reply counts

Needs: [Task-01 — Create comment-reply-count-worker](Task-01-Create-comment-reply-count-worker.md)

Consume the reply created and deleted events in batches: record their ids in the inbox, sum the per-comment deltas in
memory, and apply them to the comments in one statement, inside the same transaction.

Branch — a reply's parent no longer exists:

1. Skip it. Deleting a top-level comment takes its replies with it, so the row to decrement is already gone.

Why: the count is eventually consistent, so the number on the button can briefly disagree with the thread it opens —
the thread is the truth and the button is a hint.
