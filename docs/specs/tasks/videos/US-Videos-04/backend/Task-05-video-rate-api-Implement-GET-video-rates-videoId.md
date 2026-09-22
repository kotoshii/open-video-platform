## video-rate-api: Implement GET /video-rates/{videoId}

Needs: [US-Videos-03 Task-02 — Migrate video-rate-api to the new structure](../../US-Videos-03/backend/Task-02-Migrate-video-rate-api-to-the-new-structure.md)

`GET /video-rates/{videoId}`

Returns the acting channel's own rate on that video, or nothing when it has not rated it.

Why: one indexed lookup by channel and video is cheap enough to do on every page load, and it is what keeps the button
state right after a reload — the stored counts lag behind by a batch and could not answer this.
