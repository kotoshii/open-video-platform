## recommendation-api: Keep Gorse's items in step with videos

Needs: [Task-02 — Create recommendation-api](Task-02-Create-recommendation-api.md)

Consume the video published, updated and deleted events.

Main flow — published or updated:

1. Upsert the item: the video id, its upload time, and its tags and channel id as labels.
2. Mark it hidden unless the video is public.

Main flow — deleted:

1. Delete the item.

Deduplicate through the inbox. A channel's purge removes its items separately
([US-Channels-06 Task-16](../../../channels/US-Channels-06/backend/Task-16-recommendation-api-Delete-a-channels-Gorse-data-on-purge.md)).

Why: a hidden item is never recommended but keeps its feedback for training, so a video that leaves public and comes
back loses nothing. Accessible-by-link videos must stay out of the feed's candidates
([US-Videos-03](../../../../user-stories/videos/US-Videos-03-Manage-own-videos.md)) — hiding them here does that, and
the check when the feed is served covers the moments before this event arrives.
