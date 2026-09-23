## notification-api: Implement POST /notifications/{notificationId}/hide

Needs: [Task-03 — notification-api: Implement POST /notifications/{notificationId}/read](Task-03-notification-api-Implement-POST-notifications-notificationId-read.md)

`POST /notifications/{notificationId}/hide`

Main flow:

1. Check the notification belongs to the acting channel.
2. Set `hidden_at`, and `read_at` if it is not set yet. `activity_at` stays as it is.

Why: hiding reads the notification as well, so a hidden aggregate is closed and cannot keep counting where nobody can
see it. Hidden notifications never come back in the list.
