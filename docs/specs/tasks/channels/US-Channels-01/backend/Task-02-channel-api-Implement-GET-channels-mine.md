## channel-api: Implement GET /channels/mine

Needs: [US-Auth-01 Task-02 — Migrate channel-api to the new structure](../../../auth/US-Auth-01/backend/Task-02-Migrate-channel-api-to-the-new-structure.md)

`GET /channels/mine`

Returns every channel of the account — id, name and avatar — oldest first.

Main flow:

1. Take the account from the `User-ID` header the gateway set.
2. Return its channels.

Why: one endpoint serves every list of the account's own channels — the switcher, the channel selection page
([US-Channels-07](../../../../user-stories/channels/US-Channels-07-channel-selection-page.md)) — so the two cannot
disagree. It needs no `Channel-ID`, since it is about the account rather than the channel being acted as.
