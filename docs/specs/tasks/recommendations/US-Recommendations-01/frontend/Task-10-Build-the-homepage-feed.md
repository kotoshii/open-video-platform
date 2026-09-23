## Build the homepage feed

Needs: [Task-09 — recommendation-api: Implement GET /feed](../backend/Task-09-recommendation-api-Implement-GET-feed.md),
[US-UI-UX-03 Task-01 — Build the app shell layout](../../../ui-ux/US-UI-UX-03/frontend/Task-01-Build-the-app-shell-layout.md)

Build the homepage: a grid of video cards that loads more as the user scrolls — three columns on desktop, four with the
sidebar collapsed, one on mobile. Each card is the one the search page shows on mobile
([US-Search-01 Task-07](../../../search/US-Search-01/frontend/Task-07-Build-the-video-search-page.md)): the thumbnail
across its full width, then the channel avatar beside the title, wrapping when long, the channel name, the view count and
the upload date. Clicking a card opens the video page.

Main flow:

1. The first request goes without a cursor; each next one sends the cursor from the page before, until none comes back.
2. Opening the homepage again starts a new feed.

Branch — the list is empty:

1. An empty state, not an error.

Branch — the first page fails:

1. A full-page error state with a retry.

Branch — a later page fails:

1. The cards already loaded stay, and the bottom of the list shows a section error state with a retry.

Why: the acting channel is part of the query key, so switching channels starts a new feed rather than showing the
previous channel's cached pages — the feed belongs to the channel, not to the account.
