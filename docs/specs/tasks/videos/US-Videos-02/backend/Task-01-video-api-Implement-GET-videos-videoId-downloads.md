## video-api: Implement GET /videos/{videoId}/downloads

Needs: [US-Videos-01 Task-01 — video-api: Implement GET /videos/{videoId}/watch](../../US-Videos-01/backend/Task-01-video-api-Implement-GET-videos-videoId-watch.md)

`GET /videos/{videoId}/downloads`

Returns the renditions that exist for the video: the quality label, the format, the stored byte size and the duration.

Main flow:

1. Apply the same rules as watching — a viewer downloads exactly what they may watch.
2. Return only the qualities whose processing has finished.

Why: the size is the stored one, written when the rendition was produced, so the dialog measures nothing at request
time — and an author downloading their own video that is still gaining renditions sees exactly what exists right now.
