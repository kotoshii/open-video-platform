## Add video pipeline metrics

Needs: [Task-04 — Create the tracing bootstrap in lib](Task-04-Create-the-tracing-bootstrap-in-lib.md),
[US-Videos-05 Task-03 — Create video-processing-worker](../../videos/US-Videos-05/backend/Task-03-Create-video-processing-worker.md),
[US-Videos-05 Task-08 — video-upload-api: Stream upload progress over SSE](../../videos/US-Videos-05/backend/Task-08-video-upload-api-Stream-upload-progress-over-SSE.md)

Add metrics for video processing — BullMQ queue depth, job duration and failed jobs — and a gauge of open SSE connections
in video-upload-api.

Why: a queue that only grows means the processing workers can't keep up, long before any upload visibly fails.
