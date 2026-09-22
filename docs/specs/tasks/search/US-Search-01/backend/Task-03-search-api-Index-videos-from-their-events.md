## search-api: Index videos from their events

Needs: [Task-02 — search-api: Define the video index](Task-02-search-api-Define-the-video-index.md)

Consume the video events and keep the index in step: index a video when it is published, update it when it changes,
and remove it when it is deleted or its channel is purged. Refresh the stored channel name and avatar from the
channel-updated event.

* Index only public, published videos. A video that is private or accessible by link never enters the index at all.
* Deduplicate through the inbox, and ignore an event older than the document already stored.

Why: accessible-by-link videos are kept out here rather than filtered later, because this is one of the listing paths
that must not show them — missing one of those is how such a video leaks
([US-Videos-03](../../../../user-stories/videos/US-Videos-03-Manage-own-videos.md)).
