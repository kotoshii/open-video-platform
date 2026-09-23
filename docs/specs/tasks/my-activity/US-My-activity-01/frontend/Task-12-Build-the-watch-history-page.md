## Build the watch history page

Needs: [Task-05 — watch-history-api: Implement GET /watch-history](../backend/Task-05-watch-history-api-Implement-GET-watch-history.md),
[US-UI-UX-03 Task-02 — Build the sidebar navigation](../../../ui-ux/US-UI-UX-03/frontend/Task-02-Build-the-sidebar-navigation.md)

Build the page the sidebar's "Watch history" item opens: a search input with a submit button at the top, the list of
rows, and page controls at the bottom rather than infinite scroll. The query and the page are kept in the address.

Main flow:

1. Each row shows the thumbnail on the left, and on the right the title over at most two lines, the channel name, the
   view count and when it was watched. Clicking it opens the video page.
2. Submitting the search loads the rows whose title contains the query, still most recent first.
3. While the history is paused, the page says so.

Branch — the video is private or deleted:

1. The row is a placeholder: a grey box instead of the thumbnail, "Private video" or "Deleted video" instead of the
   title, no channel name or view count, and the watched time. It does not open anything. Build it as a shared piece —
   rated videos and My comments draw the same one.

Branch — there is no history, or nothing matches the search:

1. An empty state.

Branch — the list fails to load:

1. A full-page error state with a retry.
