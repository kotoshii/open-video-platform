## Build the rated videos page

Needs: [Task-02 — video-rate-api: Implement GET /video-rates](../backend/Task-02-video-rate-api-Implement-GET-video-rates.md),
[US-My-activity-01 Task-12 — Build the watch history page](../../US-My-activity-01/frontend/Task-12-Build-the-watch-history-page.md)

Build the page the sidebar's "Rated videos" item opens, in the shape of the watch history page: the search input at the
top, the rows, and page controls at the bottom. "Show only liked videos" sits on the right on desktop; on mobile it is
in a bottom drawer opened by a filter button next to the search, and takes effect when "Apply" is pressed.

Main flow:

1. Each row shows the thumbnail, the title, the channel name, the view count, when it was rated, and the like and
   dislike buttons — always visible, the current rate filled in, no counts. Clicking the row opens the video page.
2. Switching off "Show only liked videos" loads the list again with the dislikes as well.
3. Submitting the search loads the rated videos whose title contains the query.

Branch — the page opens:

1. The toggle comes from the address when it carries the parameter; otherwise from the choice remembered in
   localStorage; otherwise it is on. Every change goes into both.

Branch — the list loads for the first time:

1. Skeletons. Loading it again after a change keeps the current rows on screen instead.

Branch — the video is private:

1. The shared placeholder row, with the rated time and the rate buttons.

Branch — nothing is rated, or nothing matches the search:

1. An empty state.

Branch — the list fails to load:

1. A full-page error state with a retry.

Why: the address wins over the remembered choice, so a reloaded or shared link shows what it says. Keeping the previous
rows while the next response loads is what stops the list collapsing into skeletons after every removed rate.
