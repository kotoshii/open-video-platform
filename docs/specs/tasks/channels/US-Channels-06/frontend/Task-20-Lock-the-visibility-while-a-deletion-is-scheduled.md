## Lock the visibility while a deletion is scheduled

Needs: [Task-05 — video-api: Hide and restore a channel's videos](../backend/Task-05-video-api-Hide-and-restore-a-channels-videos.md),
[Task-17 — Add Delete channel to the Channel tab](Task-17-Add-Delete-channel-to-the-Channel-tab.md),
[US-Videos-03 Task-09 — Implement the change visibility modal](../../../videos/US-Videos-03/frontend/Task-09-Implement-the-change-visibility-modal.md),
[US-Videos-05 Task-24 — Implement the video details form](../../../videos/US-Videos-05/frontend/Task-24-Implement-the-video-details-form.md)

While the acting channel has a deletion scheduled, make every visibility control unavailable: the "Change visibility"
item in the video management menu, and the visibility field of the details form, on the uploading page and in the edit
modal. Each says why: the channel is scheduled for deletion, so its videos stay private until it is cancelled.

Why: cancelling puts back the visibility each video had before, so a change made during the window would be lost
anyway. The UI says so up front rather than letting the API refuse a change the user was offered.
