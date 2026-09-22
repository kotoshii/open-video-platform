## Build the video search page

Needs: [Task-04 — search-api: Implement GET /search/videos](../backend/Task-04-search-api-Implement-GET-search-videos.md),
[Task-05 — Build the search input in the navbar](Task-05-Build-the-search-input-in-the-navbar.md)

Build the page the search opens, reading its query, filters and order from the address and loading the results, with
page controls at the bottom rather than infinite scroll.

Main flow:

1. On desktop each result is a row: the thumbnail on the left, the title, channel name and view count on the right.
2. On mobile it is a card: a full-width thumbnail, then the channel avatar, title, channel name, view count and upload
   date.
3. Clicking a result opens the video page.

Branch — nothing matched:

1. An empty state saying so. This is not an error.

Branch — the request fails:

1. A full-screen error state with a retry, since the results are the page's own data.

Why: page controls rather than infinite scroll, because a search is something people come back to and scan rather than
browse endlessly.
