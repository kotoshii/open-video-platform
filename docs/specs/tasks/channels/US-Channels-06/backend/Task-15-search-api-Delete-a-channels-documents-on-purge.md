## search-api: Delete a channel's documents on purge

Needs: [Task-07 — channel-api: Run the purge as a saga](Task-07-channel-api-Run-the-purge-as-a-saga.md),
[US-Search-01 Task-01 — Create search-api](../../../search/US-Search-01/backend/Task-01-Create-search-api.md)

Consume the purge event: delete the channel's document and every video document belonging to it, then report back.

Why: the index lags behind the databases, so results are filtered when they are served as well — but leaving the
documents would keep a purged channel findable until something else re-indexed
([US-Search-01](../../../../user-stories/search/US-Search-01-Search-videos.md)).
