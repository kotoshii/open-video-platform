## video-api: Implement PUT /videos/{videoId}/visibility

Needs: [US-Videos-05 Task-17 — video-api: Implement GET and PUT /videos/{videoId}](../../US-Videos-05/backend/Task-17-video-api-Implement-GET-and-PUT-videos-videoId.md)

`PUT /videos/{videoId}/visibility` — body `{ visibility: "public" | "accessible_by_link" | "private" }`

Main flow:

1. Check the video belongs to the acting channel.
2. Save the visibility and write the video-updated event to the outbox.

**Private** is enforced on the watch path: nobody but the author gets the video. **Accessible by link** is enforced on
the listing paths instead — the video stays out of the search index, out of the feed's candidates and out of the
channel's video list, while the watch path treats it like a public one.

Why: getting that split wrong in a single listing leaks the video, which is why it is written down in every task that
lists videos rather than assumed.
