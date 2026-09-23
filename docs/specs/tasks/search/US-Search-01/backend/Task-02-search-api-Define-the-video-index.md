## search-api: Define the video index

Needs: [Task-01 — Create search-api](Task-01-Create-search-api.md)

Define the mapping for videos.

* Title and description are multi-fields: the base field with the `standard` analyzer, `.en` with `english` and `.uk`
  with `ukrainian`.
* Tags, the channel id, the channel's name and avatar, the duration in seconds, the upload date, the view count, and
  the age-restricted flag.

Why: a field can have only one analyzer, and a video's language is not recorded — so every video's text goes through
every language's analyzer. The one that fits produces proper word roots and the others add a few harmless terms, which
is cheaper than guessing the language and being wrong. Duration and date are stored as numbers and timestamps because
the UI's buckets are translated on the API side, not stored. The view count is there to order by; the results show the current one, which comes from `video-api` when
they are served.
