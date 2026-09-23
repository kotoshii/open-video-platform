## notification-api: Delete a channel's notifications on purge

Needs: [Task-07 — channel-api: Run the purge as a saga](Task-07-channel-api-Run-the-purge-as-a-saga.md),
[US-Notifications-01 Task-01 — Create notification-api](../../../notifications/US-Notifications-01/backend/Task-01-Create-notification-api.md)

Consume the purge event and delete, then report back:

* the notifications the channel received, and its notification preferences;
* the reply and mention notifications it caused in other channels' lists, found by the replier's channel id.

Why: those notifications hold a copy of the purged channel's name and comment text. A single deleted comment keeps its
notification, as an email already sent would, but a purged channel leaves nothing behind
([US-Channels-06](../../../../user-stories/channels/US-Channels-06-delete-own-channel.md)).
