## comment-rate-api: Delete a channel's comment rates on purge

Needs: [Task-07 — channel-api: Run the purge as a saga](Task-07-channel-api-Run-the-purge-as-a-saga.md),
[US-Comments-06 Task-01 — Migrate comment-rate-api to the new structure](../../../comments/US-Comments-06/backend/Task-01-Migrate-comment-rate-api-to-the-new-structure.md)

Consume the purge event: delete every comment rate the channel gave, writing a deleted event for each so the counts on
other channels' comments come down, then report back.

Why: a purged channel's votes must not keep counting on content that is still there, which is why the rows are removed
with events rather than quietly dropped.
