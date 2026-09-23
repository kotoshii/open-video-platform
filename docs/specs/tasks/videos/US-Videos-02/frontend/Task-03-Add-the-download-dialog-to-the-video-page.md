## Add the download dialog to the video page

Needs: [Task-02 — video-api: Issue a download link for a quality](../backend/Task-02-video-api-Issue-a-download-link-for-a-quality.md),
[US-Videos-01 Task-06 — Show the video details under the player](../../US-Videos-01/frontend/Task-06-Show-the-video-details-under-the-player.md)

Add the download button under the player and the dialog behind it, listing each available quality with its format, file
size and duration.

Main flow:

1. User opens the dialog, which loads the qualities.
2. Choosing one asks for its link and starts the download.

Branch — the list fails to load:

1. The dialog shows an error with a retry; the page behind it keeps working.

Branch — the user closes the dialog:

1. Nothing is downloaded.

Why: downloading registers no view — the view was already counted when the page loaded — and what happens to the
transfer afterwards is the browser's business, not the app's.
