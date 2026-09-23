## Implement the delete video confirmation

Needs: [Task-04 — video-api: Implement DELETE /videos/{videoId}](../backend/Task-04-video-api-Implement-DELETE-videos-videoId.md),
[Task-07 — Build the video management menu](Task-07-Build-the-video-management-menu.md)

Open a confirmation from "Delete" stating in plain words that the video, its files, its comments and all its rates are
deleted permanently and immediately, with no way to get them back. "Cancel" is on the left, "Delete" on the right and
disabled for 10 seconds.

Main flow:

1. User confirms; the video disappears from the list.

Branch — the request fails:

1. The toast behaviour applies and the video stays.

Why: there is no window and no undo here, unlike a channel deletion, so the confirmation has to say that outright
rather than rely on the user assuming it.
