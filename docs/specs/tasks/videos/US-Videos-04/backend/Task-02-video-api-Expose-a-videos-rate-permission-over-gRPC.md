## video-api: Expose a video's rate permission over gRPC

Needs: [US-Videos-05 Task-17 — video-api: Implement PUT /videos/{videoId}](../../US-Videos-05/backend/Task-17-video-api-Implement-PUT-videos-videoId.md)

Add the gRPC method that answers whether a video exists, whether the caller may watch it, and whether its author allows
rates.

Why: `video-rate-api` cannot read the videos table, and a rate on a video that does not exist — or on one whose author
turned rates off — must be refused rather than stored and counted.
