## Add channel search to the search page

Needs: [Task-04 — search-api: Implement GET /search/channels](../backend/Task-04-search-api-Implement-GET-search-channels.md),
[US-Search-01 Task-07 — Build the video search page](../../US-Search-01/frontend/Task-07-Build-the-video-search-page.md)

Wire the navbar toggle's channel mode: the placeholder changes, the filters popup offers only the order — Relevancy or
Most popular — and the search page shows channel results.

Main flow:

1. Each result shows the avatar, the channel name, its description and its subscriber count.
2. Clicking one opens that channel's page.

Branch — a channel has no subscribers:

1. No count is shown for it.

Branch — nothing matched:

1. The same empty state as video search.

Why: one page renders both kinds of result from the same address, so switching the toggle is a different query rather
than a different page.
