## Store the current channel and send it with requests

Needs: [_platform frontend Task-03 — Create the API client](../../../_platform/frontend/Task-03-Create-the-API-client.md),
[US-Channels-01 Task-02 — channel-api: Implement GET /channels/mine](../../US-Channels-01/backend/Task-02-channel-api-Implement-GET-channels-mine.md)

Keep the current channel on the client: in localStorage, mirrored into a cookie, and read through the getter the API
client already calls so that every request carries `X-Channel-Id`.

Main flow:

1. The app starts with the stored channel as the current one.
2. Every request carries it, and the gateway checks it against the token's claim.

Branch — the gateway answers 403 because the channel is not in the claim any more:

1. Drop the stored value and send the user to the channel selection page
   ([US-Channels-07](../../../../user-stories/channels/US-Channels-07-channel-selection-page.md)).

Why: localStorage is per browser, so one account can act as different channels on two devices at once. The cookie exists
only because the server cannot read localStorage while it renders a page — the same reason the theme and the sidebar
state are cookies.
