## notification-api: Implement GET /notifications

Needs: [US-Notifications-01 Task-08 — notification-worker: Create reply and mention notifications](../../US-Notifications-01/backend/Task-08-notification-worker-Create-reply-and-mention-notifications.md)

`GET /notifications?page=...` — a page of the acting channel's notifications and the total

Main flow:

1. Leave out hidden notifications, and order by `activity_at`, newest first.
2. Return each with its id, type, whether it is read, and `activity_at`.
3. Aggregated ones add the count, and for new comments the video's id and title. Replies and mentions add the replier's
   name, the full text, the comment id and the video id.

Why: the time shown and the order both come from `activity_at`, one field computed by the writer — the client never
decides between a creation time and a last-update time. Ordering by activity with page controls lets a busy
notification jump to page one while the user is on page three; that is accepted for a notification list.
