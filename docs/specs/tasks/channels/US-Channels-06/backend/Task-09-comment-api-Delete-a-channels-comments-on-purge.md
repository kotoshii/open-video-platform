## comment-api: Delete a channel's comments on purge

Needs: [Task-07 — channel-api: Run the purge as a saga](Task-07-channel-api-Run-the-purge-as-a-saga.md),
[US-Videos-03 Task-01 — Migrate comment-api to the new structure](../../../videos/US-Videos-03/backend/Task-01-Migrate-comment-api-to-the-new-structure.md)

Consume the purge event: delete every comment and reply the channel wrote, a batch per transaction, writing the
comment-deleted events to the outbox as it goes, then report back.

Why: the comment counts on other channels' videos come down through those events, and the rates other channels gave
those comments are removed by the service that owns them
([US-Comments-06](../../../../user-stories/comments/US-Comments-06-Like-dislike-comments.md)) — this service only
deletes what is in its own database.
