## video-api: Hide and restore an account's videos

Needs: [Task-02 — account-api: Implement POST /accounts/deletion/confirm](Task-02-account-api-Implement-POST-accounts-deletion-confirm.md),
[US-Channels-06 Task-05 — video-api: Hide and restore a channel's videos](../../../channels/US-Channels-06/backend/Task-05-video-api-Hide-and-restore-a-channels-videos.md)

Consume the account's deletion-scheduled and deletion-cancelled events. Store each video's account id when it is
created — `video-upload-api` passes it from the `User-ID` header with the create call.

Main flow — scheduled:

1. Mark the account, and set every one of its videos to private, storing the visibility it had — unless the video is
   already hidden by its channel's deletion, whose stored value stays.
2. While the mark is set, refuse visibility changes and publish new videos as private, for every channel of the account —
   one created during the window included.

Main flow — cancelled:

1. Clear the mark and restore the videos whose channel has no deletion of its own scheduled.

Change the channel's restore the same way: it leaves the videos private while their account is marked. Write a
video-updated event per changed video, as for channels.

Add unit tests if the logic turns out complex.

Why: two independent schedules can hide the same video, and it has only one stored visibility. Storing it only when the
video is not hidden yet, and restoring only when neither mark is left, keeps a cancel from putting back "private" — or
from showing a channel whose own deletion is still pending.
