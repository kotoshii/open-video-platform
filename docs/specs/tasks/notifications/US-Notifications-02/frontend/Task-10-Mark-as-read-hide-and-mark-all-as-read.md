## Mark as read, hide and mark all as read

Needs: [Task-04 — notification-api: Implement POST /notifications/{notificationId}/hide](../backend/Task-04-notification-api-Implement-POST-notifications-notificationId-hide.md),
[Task-05 — notification-api: Implement POST /notifications/read-all](../backend/Task-05-notification-api-Implement-POST-notifications-read-all.md),
[Task-08 — Build the notification center](Task-08-Build-the-notification-center.md)

Add "Hide" and "Mark as read" to each notification on hover — only "Hide" on a read one — always visible on mobile, and
make "Mark all as read" work.

Main flow — mark as read:

1. It takes effect straight away, with no confirmation, and the badge goes down.

Main flow — hide:

1. A confirmation modal; on confirm, the notification is read and leaves the list.

Main flow — mark all as read:

1. A confirmation modal; on confirm, every unread notification becomes read and the badge disappears.

Branch — the user cancels:

1. The modal closes and nothing changes.

Branch — the request fails:

1. A toast, and the notifications stay as they were.

Why: marking as read only restyles a row, so the cached page is patched; hiding takes a row off the page and shifts the
rest, so the list is loaded again after it.
