## video-rate-count-worker: Apply the rate counts

Needs: [Task-01 — Migrate video-rate-count-worker to the new structure](Task-01-Migrate-video-rate-count-worker-to-the-new-structure.md),
[Task-03 — video-rate-api: Implement POST /video-rates/{videoId}](Task-03-video-rate-api-Implement-POST-video-rates-videoId.md)

Consume the rate events in batches: record their ids in the inbox, sum the likes and dislikes per video in memory, and
apply the deltas to the videos in one statement, inside the same transaction.

Branch — a rate arrives for a video that no longer exists:

1. Skip it without failing the batch.

Why: switching a rate is a delete and a create for the same video, and both carry that video's id as their key, so they
land on one partition and are applied in order.
