## video-api: Search a channel's videos

Needs: [US-Channels-04 Task-02 — video-api: Implement GET /videos/for-channel/{channelId}](../../../channels/US-Channels-04/backend/Task-02-video-api-Implement-GET-videos-for-channel-channelId.md)

`GET /videos/for-channel/{channelId}/search?query=...&sort=...&page=...`

Main flow:

1. Match the query as a substring of the title or the description — tags are not searched here.
2. Apply exactly the filters and the sorting the channel's video list uses, and page it the same way.
3. Return the page and its total, as the list does.

The response can be smaller than the global search's: the channel is known, so its name and avatar are not repeated per
hit.

Why: this runs against the videos database rather than Elasticsearch, because the index holds only published public
videos while the author's own channel page lists everything they have. An index-backed search would quietly fail to
find videos the author can see in the list right above the box.
