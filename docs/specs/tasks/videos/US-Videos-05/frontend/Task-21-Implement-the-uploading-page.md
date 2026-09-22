## Implement the uploading page

Needs: [Task-07 — video-upload-api: Implement GET /video-uploads/{videoId}](../backend/Task-07-video-upload-api-Implement-GET-video-uploads-videoId.md),
[Task-20 — Implement the file selection page](Task-20-Implement-the-file-selection-page.md)

Build the page at a video's own upload address: the details form on the left and the status box on the right, with the
upload percentage, the video's link and a control to copy it, the file name and size, the "Save" and "Publish" buttons
with the note that saving does not publish, and a single alert underneath.

On mobile the order changes: the status box first, then the alert, then the form at full width.

Branch — the video is already published:

1. The page is not available for it; the user goes to the watch page instead.

Branch — the video belongs to somebody else:

1. The page is not available; the user goes to the homepage.

Branch — the upload never finished and can no longer be resumed:

1. The page offers the file selection again, and choosing the same file starts a fresh upload.

Why: the link is shown from the start because the video record exists from `initialize` — it is not a share link, since
an unpublished video is not visible to anyone but its author.
