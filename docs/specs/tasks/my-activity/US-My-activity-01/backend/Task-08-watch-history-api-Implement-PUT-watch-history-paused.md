## watch-history-api: Implement PUT /watch-history/paused

Needs: [Task-01 — Create watch-history-api](Task-01-Create-watch-history-api.md)

`PUT /watch-history/paused` — body `{ paused: boolean }`

Set or clear the acting channel's paused flag and return the new state. Setting it to what it already is answers as a
success.

Why: the flag lives with the history rather than on the channel in `channel-api`, because both places that read it on
every watch event — this service's consumer and the recommender's — then get it cheaply: a local query here, and one
cached call there.
