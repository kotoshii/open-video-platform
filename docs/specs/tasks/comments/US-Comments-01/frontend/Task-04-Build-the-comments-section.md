## Build the comments section

Needs: [Task-01 — comment-api: Implement GET /comments](../backend/Task-01-comment-api-Implement-GET-comments.md),
[US-Videos-01 Task-04 — Build the video page layout](../../../videos/US-Videos-01/frontend/Task-04-Build-the-video-page-layout.md)

Build the section under the video: a header with the total number of comments — replies included — and the sort control
offering Newest first, Oldest first, Most likes and Most dislikes, then the list, loading more as the user scrolls.

Main flow:

1. The header's total comes from the video's own comment count.
2. Changing the sorting loads the list again from the beginning.

Branch — there are no comments:

1. An empty state inviting the user to be the first.

Branch — the list fails to load:

1. The whole section shows an error state with a retry, and the rest of the video page keeps working.

Branch — on mobile:

1. The section lives in the drawer that "Comments" opens, and it is the drawer's own scrolling that loads more.

Why: a toast would not do here — with the list gone there would be nothing behind it to look at.
