## Publish the video from the uploading page

Needs: [Task-19 — video-api: Implement POST /videos/{videoId}/publish](../backend/Task-19-video-api-Implement-POST-videos-videoId-publish.md),
[Task-23 — Show processing progress from SSE](Task-23-Show-processing-progress-from-SSE.md)

Main flow:

1. "Publish" stays unavailable until the lowest quality is ready, which the stream reports.
2. The user clicks it; the video becomes visible according to the visibility that was set.
3. The page confirms it and leads to the watch page, which is where the upload address now goes.

Branch — processing fails on the lowest quality:

1. The alert says the video cannot be published, rather than leaving the button waiting for ever.

Why: publishing is gated on one quality rather than all of them, so a long video is watchable long before its
best rendition exists.
