## Build the My comments page

Needs: [Task-02 — comment-api: Implement GET /comments/current](../backend/Task-02-comment-api-Implement-GET-comments-current.md),
[US-My-activity-01 Task-12 — Build the watch history page](../../US-My-activity-01/frontend/Task-12-Build-the-watch-history-page.md)

Build the page the sidebar's "My comments" item opens: the search input at the top, the list, and page controls at the
bottom. There is no mobile mockup; on mobile the same item stacks in one column.

Main flow:

1. Each item shows a small video thumbnail with the video's title beside it, over at most two lines; the video's channel
   name on one line; the name of the channel that wrote the comment, and when it was posted; then the comment text.
2. Clicking the thumbnail or the title opens the video page with `?comment=<id>`, showing that comment's thread.
3. Text longer than 400 characters is cut off with "Show more", which opens the full comment in a scrollable modal.
4. Submitting the search loads the comments whose text or video title contains the query.

Branch — the video is private:

1. The video part is the shared placeholder, and nothing opens from it; the comment text and the rest stay.

Branch — no comments, or nothing matches the search:

1. An empty state.

Branch — the list fails to load:

1. A full-page error state with a retry.

