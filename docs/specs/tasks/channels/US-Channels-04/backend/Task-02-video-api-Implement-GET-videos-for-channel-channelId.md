## video-api: Implement GET /videos/for-channel/{channelId}

Needs: [US-Channels-03 Task-03 — channel-api: Expose the age-restricted setting over gRPC](../../US-Channels-03/backend/Task-03-channel-api-Expose-the-age-restricted-setting-over-gRPC.md),
[US-Videos-05 Task-01 — Migrate video-api to the new structure](../../../videos/US-Videos-05/backend/Task-01-Migrate-video-api-to-the-new-structure.md)

`GET /videos/for-channel/{channelId}` — a page of that channel's videos, with the total the same filter produced

Main flow:

1. Order by newest, most viewed or oldest, and page with a limit and an offset.
2. Filter by what the viewer may see: everything on their own channel, otherwise only published public videos.
3. Leave out age-restricted videos when the viewer is too young by the `Birthdate` header, or their acting channel has
   the setting off.
4. Return the page and the total.

Videos that are accessible by link are a listing path, so they are excluded here — only the watch path treats them like
public ones ([US-Videos-03](../../../../user-stories/videos/US-Videos-03-Manage-own-videos.md)).

Why: the total comes from the query that produced the page, so the count above the list can never disagree with it —
and no counter per audience has to be kept to make that true.
