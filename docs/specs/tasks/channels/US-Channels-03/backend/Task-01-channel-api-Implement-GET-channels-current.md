## channel-api: Implement GET /channels/current

Needs: [US-Auth-01 Task-02 — Migrate channel-api to the new structure](../../../auth/US-Auth-01/backend/Task-02-Migrate-channel-api-to-the-new-structure.md)

`GET /channels/current`

Returns the channel being acted as: name, description, avatar and the "Show age-restricted content" setting. A later
story adds the date a scheduled deletion will run
([US-Channels-06](../../../../user-stories/channels/US-Channels-06-delete-own-channel.md)). The notification preferences
on the same tab come from `notification-api`
([US-Notifications-01](../../../../user-stories/notifications/US-Notifications-01-Notifications-config.md)).

Main flow:

1. Take the channel from the `Channel-ID` header the gateway set.
2. Return it.

Why: the settings page always edits the channel being acted as, so there is no id in the path — and the gateway has
already checked that the header's channel belongs to the account.
