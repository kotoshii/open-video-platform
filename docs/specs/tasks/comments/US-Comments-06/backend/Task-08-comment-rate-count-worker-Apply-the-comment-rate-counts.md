## comment-rate-count-worker: Apply the comment rate counts

Needs: [Task-02 — Migrate comment-rate-count-worker to the new structure](Task-02-Migrate-comment-rate-count-worker-to-the-new-structure.md),
[Task-04 — comment-rate-api: Implement POST /comment-rates/{commentId}](Task-04-comment-rate-api-Implement-POST-comment-rates-commentId.md)

Consume the comment rate events in batches: record their ids in the inbox, sum the likes and dislikes per comment in
memory, and apply the deltas in one statement inside the same transaction.

Branch — the comment no longer exists:

1. Skip it without failing the batch.

Why: sorting by Most likes reads these counters, so the order lags by a batch — a comment somebody just liked keeps its
place until the worker catches up, which is the same trade-off the subscriber count in channel search accepts.
