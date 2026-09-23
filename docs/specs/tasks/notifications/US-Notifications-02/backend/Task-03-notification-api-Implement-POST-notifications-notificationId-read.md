## notification-api: Implement POST /notifications/{notificationId}/read

Needs: [Task-01 — notification-api: Implement GET /notifications](Task-01-notification-api-Implement-GET-notifications.md)

`POST /notifications/{notificationId}/read`

Main flow:

1. Check the notification belongs to the acting channel.
2. Set `read_at` if it is not set yet; reading it twice answers as a success.

`activity_at` must not change here, or reading an old notification moves it to the top — a last-modified column kept
by the ORM or a trigger is the wrong one to order by.

Why: reading an aggregated notification also closes it. The row leaves the partial unique index, so the next event
starts a new notification from one, with nothing else to handle.
