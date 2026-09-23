## watch-history-api: Delete a channel's history on purge

Needs: [Task-07 — channel-api: Run the purge as a saga](Task-07-channel-api-Run-the-purge-as-a-saga.md),
[US-My-activity-01 Task-01 — Create watch-history-api](../../../my-activity/US-My-activity-01/backend/Task-01-Create-watch-history-api.md)

Consume the purge event: delete the channel's watch history rows and its paused flag, then report back.

Why: these rows are the channel's own viewing, so they go with it — unlike a row whose video was deleted, which stays as
a placeholder ([US-My-activity-01](../../../../user-stories/my-activity/US-My-activity-01-Watch-history.md)).
