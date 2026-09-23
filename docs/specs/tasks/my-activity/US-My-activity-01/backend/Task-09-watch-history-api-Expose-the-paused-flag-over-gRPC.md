## watch-history-api: Expose the paused flag over gRPC

Needs: [Task-08 — watch-history-api: Implement PUT /watch-history/paused](Task-08-watch-history-api-Implement-PUT-watch-history-paused.md)

Add the gRPC method that takes a list of channel ids and answers which of them have their history paused.

Why: `recommendation-api` asks for the channels of a whole batch of watch events at once, the same way listings ask
`channel-api` for the age-restricted setting — one owner of the flag, and one short cache on the caller's side.
