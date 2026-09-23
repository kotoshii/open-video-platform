## notification-api: Implement PUT /notifications/preferences

Needs: [Task-03 — notification-api: Implement GET /notifications/preferences](Task-03-notification-api-Implement-GET-notifications-preferences.md)

`PUT /notifications/preferences` — body `{ inApp: { newSubscribers, newComments, replies, mentions }, email: { replies,
mentions } }`

Main flow:

1. Upsert the acting channel's row with all six values.

Branch — an Email toggle is on while the `Email-Verified` header is false:

1. Reject with its code; nothing is saved.

Why: the unavailable toggle in the UI is not the enforcement. A confirmed email stays confirmed — a new address is
confirmed through its own link — so a toggle that was allowed on never has to be switched back off. Preferences are
read when a notification is written, not when it is shown, so a change applies from the next event and leaves what was
already received alone.
