## Build the channel video list

Needs: [Task-02 — video-api: Implement GET /videos/for-channel/{channelId}](../backend/Task-02-video-api-Implement-GET-videos-for-channel-channelId.md),
[Task-03 — Build the channel page header](Task-03-Build-the-channel-page-header.md)

Build the list under the header: the Newest, Most viewed and Oldest sort buttons, the videos, and page controls at the
bottom rather than infinite scroll. The search input on the same line belongs to
[US-Search-03](../../../../user-stories/search/US-Search-03-Search-videos-on-channel-page.md).

Main flow:

1. Each video shows its thumbnail, title, views and date; on mobile a single column with the thumbnail on the left.
2. Clicking one opens its watch page.

Branch — the user's own channel:

1. Every video is listed whatever its state — private, accessible by link, uploading, processing or failed — each
   showing that state, and one that is not published opens its uploading page instead
   ([US-Videos-05](../../../../user-stories/videos/US-Videos-05-Upload-videos.md)).
2. The 3-dot menu appears on hover, and is always visible on mobile
   ([US-Videos-03](../../../../user-stories/videos/US-Videos-03-Manage-own-videos.md)).

Branch — there is nothing the viewer can see:

1. An empty state.

Why: page controls rather than infinite scroll keep a video's position stable while its author works down their own
list.
