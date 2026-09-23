## video-api: Look up the visible videos over gRPC

Needs: [US-Channels-03 Task-03 — channel-api: Expose the age-restricted setting over gRPC](../../../channels/US-Channels-03/backend/Task-03-channel-api-Expose-the-age-restricted-setting-over-gRPC.md)

Add the gRPC method that takes a list of video ids and the viewer — the acting channel and the date from the `Birthdate`
header — and returns, in the order given, the videos that viewer may see in a listing, with what a card shows: the
title, the thumbnail version, the view count, the upload date and the channel id.

"May see in a listing" means published, public, and allowed by the viewer's age and their channel's age-restricted
setting. Accessible-by-link videos are left out, because only the watch path treats them like public ones
([US-Videos-03](../../../../user-stories/videos/US-Videos-03-Manage-own-videos.md)).

Video search calls it for every page it serves, and so do the feed
([US-Recommendations-01](../../../../user-stories/recommendations/US-Recommendations-01-Feed.md)) and similar videos
([US-Recommendations-02](../../../../user-stories/recommendations/US-Recommendations-02-Similar-videos.md)).

Why: the search index and Gorse are copies that lag behind the videos table, so every listing built from them checks
its page against the current state here. One call per page keeps that to one round trip, and the fields that change
often — the view count and the thumbnail version — come from the source rather than from the copy.
