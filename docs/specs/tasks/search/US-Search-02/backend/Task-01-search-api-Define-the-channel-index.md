## search-api: Define the channel index

Needs: [US-Search-01 Task-02 — search-api: Define the video index](../../US-Search-01/backend/Task-02-search-api-Define-the-video-index.md)

Define the mapping for channels, in an index of its own in the same cluster: the name as a multi-field with the same
three analyzers as video titles, the description, the avatar and the subscriber count.

Why: channels and videos are searched separately and ranked differently, so they are two indices rather than one with a
type field — and the name gets the same language treatment as a title, since channel names are written in both
languages too.
