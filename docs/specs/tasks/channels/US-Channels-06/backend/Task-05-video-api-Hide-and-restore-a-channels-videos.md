## video-api: Hide and restore a channel's videos

Needs: [Task-02 — channel-api: Implement POST /channels/deletion/confirm](Task-02-channel-api-Implement-POST-channels-deletion-confirm.md),
[US-Videos-03 Task-03 — video-api: Implement PUT /videos/{videoId}/visibility](../../../videos/US-Videos-03/backend/Task-03-video-api-Implement-PUT-videos-videoId-visibility.md)

Consume the deletion-scheduled and deletion-cancelled events.

Main flow — scheduled:

1. Store each video's current visibility and set it to private.
2. Remember on the channel that a deletion is scheduled, so a video published during the window is private as well.

Main flow — cancelled:

1. Put every visibility back and clear that mark.

Either way, write a video-updated event per video to the outbox in the same transaction, so the search index drops the
videos and Gorse hides them — and takes them back on a cancel.

While the mark is set, refuse a visibility change with its code — through `PUT /videos/{videoId}/visibility` and
through the visibility in `PUT /videos/{videoId}` — or a cancel would overwrite it with the stored one.

Why: `private` is a value every read path already handles, so nothing else in the system needs a notion of "scheduled
for deletion" — and the channel's video count follows by itself, because it is computed from what the viewer can see.
The copies still have to hear about it: without the events they would keep serving the videos for the whole week, held
back only by the checks at serve time.
