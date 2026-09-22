## Build the channel block and switcher

Needs: [Task-02 — channel-api: Implement GET /channels/mine](../backend/Task-02-channel-api-Implement-GET-channels-mine.md),
[US-UI-UX-03 Task-02 — Build the sidebar navigation](../../../ui-ux/US-UI-UX-03/frontend/Task-02-Build-the-sidebar-navigation.md)

Fill the sidebar's channel slot: the current channel's avatar and name, with the arrow that opens the switcher — a
popup on desktop, a bottom drawer on mobile — listing every channel of the account, with "Create new channel" at the
bottom.

Main flow:

1. The collapsed sidebar shows the avatar alone, with the arrow next to it; expanded, the avatar and the name.
2. Clicking the name opens that channel's page
   ([US-Channels-04](../../../../user-stories/channels/US-Channels-04-see-own-and-other-channels.md)).
3. Clicking the arrow opens the list, with the current channel marked.

Branch — the account already has 10 channels:

1. "Create new channel" is unavailable and says why.

Choosing a channel from the list comes with
[US-Channels-02](../../../../user-stories/channels/US-Channels-02-freely-switch-between-channels.md); the creation form
is Task-05.

Why: one component renders the list for the popup and the drawer, so the two cannot drift apart — and the channel
selection page reuses it again.
