## video-comment-count-worker: Apply the comment counts

Needs: [Task-01 — Migrate video-comment-count-worker to the new structure](Task-01-Migrate-video-comment-count-worker-to-the-new-structure.md),
[Task-03 — comment-api: Implement POST /comments/{videoId}](Task-03-comment-api-Implement-POST-comments-videoId.md)

Consume the comment events in batches: record their ids in the inbox, sum the per-video deltas in memory, and apply
them to the videos in one statement, inside the same transaction.

Replies count too, and a deleted top-level comment lowers the total by itself plus its replies
([US-Comments-05](../../../../user-stories/comments/US-Comments-05-Manage-own-comments.md)).

Why: the header's total and the rows the list shows have to move together — the purge of a channel removes comments
through the same events, so no state exists where the header counts comments the list cannot show.
