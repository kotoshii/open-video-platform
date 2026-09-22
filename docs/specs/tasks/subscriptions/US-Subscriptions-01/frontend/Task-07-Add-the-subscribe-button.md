## Add the subscribe button

Needs: [Task-03 — subscription-api: Implement POST /subscriptions](../backend/Task-03-subscription-api-Implement-POST-subscriptions.md),
[Task-05 — subscription-api: Implement GET /subscriptions/{channelId}](../backend/Task-05-subscription-api-Implement-GET-subscriptions-channelId.md),
[US-Channels-04 Task-03 — Build the channel page header](../../../channels/US-Channels-04/frontend/Task-03-Build-the-channel-page-header.md)

Build the button and put it in both slots left for it: the channel page header, and the channel row under the player on
the video page. On mobile the one in the header is full width.

Main flow:

1. It reads "Subscribe" when the acting channel is not subscribed, and "Subscribed" when it is.
2. Clicking it switches the state straight away, before the server answers, with no confirmation either way.

Branch — the channel is the one acting:

1. The button is not rendered at all.

Branch — the request fails:

1. The button goes back to its previous state and a toast says what went wrong.

Why: the subscriber count next to it is the stored one and is not adjusted here, so it may take a few seconds to move —
the button's own state is what confirms the click.
