## notification-worker: Count new comments on videos

Needs: [Task-05 — comment-api: Carry the recipients on comment events](Task-05-comment-api-Carry-the-recipients-on-comment-events.md),
[Task-06 — notification-worker: Count new subscribers](Task-06-notification-worker-Count-new-subscribers.md)

Consume the created and deleted events of top-level comments, and the video deleted event. Replies never count here.

Main flow — a comment is created:

1. Skip it when the commenter is the video's channel, or that channel has the type turned off in-app.
2. Upsert the video channel's open notification for that video, the same way as subscribers, and store the title from
   the event.

Main flow — a comment is deleted:

1. Lower the open notification by creation time, as for subscribers.

Main flow — the video is deleted:

1. Delete that video's New comments notifications, read or not.

Why: the key includes the video, because "23 new comments on *How to cook pasta*" tells the user where to look and
"23 new comments" does not. Counting replies here would notify the video's owner twice about a reply to their own
comment.
