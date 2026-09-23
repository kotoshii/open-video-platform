## notification-api: Implement GET /notifications/preferences

Needs: [Task-01 — Create notification-api](Task-01-Create-notification-api.md)

`GET /notifications/preferences` — the acting channel's preferences: In-app for all four types, Email for replies and
mentions

Branch — the channel has no stored row:

1. Return the defaults: every In-app toggle on, every Email toggle off.

Why: the defaults live in code, so creating a channel — the one made at sign-up included — writes nothing here, and no
path that creates a channel can forget to.
