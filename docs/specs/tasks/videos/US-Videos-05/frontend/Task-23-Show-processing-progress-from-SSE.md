## Show processing progress from SSE

Needs: [Task-08 — video-upload-api: Stream upload progress over SSE](../backend/Task-08-video-upload-api-Stream-upload-progress-over-SSE.md),
[Task-21 — Implement the uploading page](Task-21-Implement-the-uploading-page.md)

Connect the page to the upload's event stream with `EventSource`, and keep the one alert showing the current state.

Main flow:

1. The page renders the status it loaded, then follows the stream.
2. Each milestone replaces the alert's content: the upload finishing, the thumbnails appearing, each quality becoming
   available, processing finishing.

Branch — the connection drops:

1. `EventSource` reconnects by itself, and the server sends the current status before any live updates.

Branch — qualities arrive out of order:

1. Keep them as a set rather than a sequence — 1080p can finish before 480p.

Why: the alert shows the current state rather than a history, so the page is readable after a reconnect, when several
milestones may have passed while nobody was listening.
