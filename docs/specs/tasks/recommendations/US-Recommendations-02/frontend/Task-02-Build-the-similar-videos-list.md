## Build the similar videos list

Needs: [Task-01 — search-api: Implement GET /search/videos/{videoId}/similar](../backend/Task-01-search-api-Implement-GET-search-videos-videoId-similar.md),
[US-Videos-01 Task-04 — Build the video page layout](../../../videos/US-Videos-01/frontend/Task-04-Build-the-video-page-layout.md),
[US-Search-01 Task-07 — Build the video search page](../../../search/US-Search-01/frontend/Task-07-Build-the-video-search-page.md)

Fill the video page's similar videos slot with the list, using the card the search page shows on mobile: one column
down the right side on desktop, and on mobile after the row of actions. There is no paging and no loading more.
Clicking a card opens that video.

Branch — fewer than 20 came back:

1. Show what there is; nothing fills the rest.

Branch — nothing came back:

1. An empty state inside the section.

Branch — the request fails:

1. The section shows its error state with a retry, and the video keeps playing.
