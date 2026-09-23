## Open a notification

Needs: [Task-03 — notification-api: Implement POST /notifications/{notificationId}/read](../backend/Task-03-notification-api-Implement-POST-notifications-notificationId-read.md),
[Task-08 — Build the notification center](Task-08-Build-the-notification-center.md),
[US-Comments-01 Task-06 — Open a linked comment thread](../../../comments/US-Comments-01/frontend/Task-06-Open-a-linked-comment-thread.md)

Make notifications open what they are about, and mark them read as they do.

Main flow:

1. A reply or a mention opens the video page with `?comment=<id>`, showing that thread.
2. A new comments notification opens the video page.
3. An unread one becomes read, and the badge goes down by one.

Branch — a new subscribers notification:

1. It is not clickable; it is read through its own button.

Branch — the comment or the video has been deleted:

1. The video page says so — a short note in place of the thread, or its "no longer available" state for the video.

Why: the notification center never checks whether the content still exists. The video page already has to handle any
link to a missing comment or video, from emails too, so that check lives there once.
