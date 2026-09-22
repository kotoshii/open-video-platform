## Build the channel page header

Needs: [Task-01 — channel-api: Implement GET /channels/{channelId}](../backend/Task-01-channel-api-Implement-GET-channels-channelId.md)

Build the channel page and its header: avatar, channel name, subscriber count, video count and "Show description",
which opens the description in a modal on desktop and a drawer on mobile.

Branch — the channel has no subscribers:

1. No subscriber count is shown at all.

Branch — it is the user's own channel:

1. The avatar, the name and the description get an edit affordance — a pen on hover on desktop, a visible button on
   mobile — and each opens the settings page on the Channel tab.

Branch — it is somebody else's channel:

1. No edit affordances, and the subscribe button goes in the header instead
   ([US-Subscriptions-01](../../../../user-stories/subscriptions/US-Subscriptions-01-Subscribe-to-other-channels.md)).

Branch — the channel does not exist:

1. A full-page error state.

Why: own and other channels are the same page. Ownership is the acting channel id matching the page's, so switching
channels changes which page counts as "own" without any re-authentication.
