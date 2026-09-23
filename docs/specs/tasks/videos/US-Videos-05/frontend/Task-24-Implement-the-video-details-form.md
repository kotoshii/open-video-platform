## Implement the video details form

Needs: [Task-17 — video-api: Implement GET and PUT /videos/{videoId}](../backend/Task-17-video-api-Implement-GET-and-PUT-videos-videoId.md),
[Task-21 — Implement the uploading page](Task-21-Implement-the-uploading-page.md)

Build the details form as one component: title, description, tags as removable chips, the "Allow comments" and "Allow
rates" toggles, the visibility — public, accessible by link, private — and the audience, a yes or no answer to whether
the video holds material unsuitable for younger viewers.

The uploading page renders it on the left, with "Save" in the status box; the edit modal in
[US-Videos-03](../../../../user-stories/videos/US-Videos-03-Manage-own-videos.md) renders the same component.

Main flow:

1. The user edits at any time, while the file is still uploading or processing.
2. "Save" stores the details, and the page says that saving neither publishes the video nor interrupts anything.

Branch — the title is empty:

1. A field error, and nothing is sent.

Why: one component for both places means the fields cannot drift apart as stories add to them — and the same endpoint
serves both.
