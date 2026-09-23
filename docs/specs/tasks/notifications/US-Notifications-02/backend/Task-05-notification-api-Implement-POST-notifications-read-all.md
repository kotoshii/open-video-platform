## notification-api: Implement POST /notifications/read-all

Needs: [Task-03 — notification-api: Implement POST /notifications/{notificationId}/read](Task-03-notification-api-Implement-POST-notifications-notificationId-read.md)

`POST /notifications/read-all`

Set `read_at` on every unread notification of the acting channel, in one statement, leaving `activity_at` alone.

Why: "all" means the channel being acted as, not the account — every channel has its own notifications and its own
badge.
