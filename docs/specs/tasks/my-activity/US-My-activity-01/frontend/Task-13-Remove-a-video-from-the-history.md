## Remove a video from the history

Needs: [Task-06 — watch-history-api: Implement DELETE /watch-history/{videoId}](../backend/Task-06-watch-history-api-Implement-DELETE-watch-history-videoId.md),
[Task-12 — Build the watch history page](Task-12-Build-the-watch-history-page.md)

Add the delete button to each row — on hover on desktop, always visible on mobile — placeholder rows included.

Main flow:

1. Clicking it opens a confirmation modal.
2. On confirm, remove the video and load the list again.

Branch — the user cancels:

1. The modal closes and nothing changes.

Branch — the request fails:

1. A toast, and the row stays.

Why: removing a row shifts every page after it by one, so the list is loaded again rather than patched on the client.
