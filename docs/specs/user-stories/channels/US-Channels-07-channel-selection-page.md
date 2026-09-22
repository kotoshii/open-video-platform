## US-Channels-07 — Channel selection page

**Description**

As an authenticated user with more than one channel, I want to choose which of my channels I am acting as before I
enter the app, so that everything I do next — watching, commenting, subscribing — is attributed to the channel I
intended.

The page sits outside the global layout ([US-UI-UX-03](../ui-ux/US-UI-UX-03-Global-layout.md)): the app cannot be used
until a channel is chosen, so there is nothing for a navbar or a sidebar to navigate yet.

**User flows**

Pick a channel after logging in — main flow:

1. User logs in with an account that has more than one channel
   ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)).
2. The channel selection page opens, listing every channel of the account with its avatar and name.
3. User clicks a channel.
4. It becomes the current channel and the user lands on the homepage.

Pick a channel — branches:

* **The account has one channel** (step 2) — the page is skipped entirely and the user lands on the homepage acting as
  that channel.
* **Arriving from a channel deletion** (step 2) — the page is reached the same way after a channel is deleted
  ([US-Channels-06](./US-Channels-06-delete-own-channel.md)), and behaves identically.
* **The stored current channel is gone** (step 2) — the channel was purged while the user was away, so the app cannot
  restore it ([US-Channels-02](./US-Channels-02-freely-switch-between-channels.md)) and asks for a choice here.

Create a channel from this page:

1. User clicks "Create new channel" at the bottom of the list.
2. The creation form opens in a modal, exactly the one reached from the channel switcher
   ([US-Channels-01](./US-Channels-01-create-multiple-channels.md)).
3. On success the new channel becomes the current one and the user lands on the homepage.

**Acceptance criteria**

* After logging in with an account that has more than one channel, the user lands on the channel selection page rather
  than the homepage.
* An account with exactly one channel never sees the page — it is skipped and that channel becomes the current one.
* The page lists every channel of the account with its avatar and name.
* Choosing a channel makes it the current one and opens the homepage.
* The page has neither the navbar nor the sidebar; like the auth pages, it shows the language selector and the theme
  toggle in the top right corner ([US-UI-UX-03](../ui-ux/US-UI-UX-03-Global-layout.md)).
* The page has a "Create new channel" action, which opens the same creation form as the channel switcher and, on
  success, continues into the app as the new channel
  ([US-Channels-01](./US-Channels-01-create-multiple-channels.md)).
* The page is reached in the same way after a channel is deleted
  ([US-Channels-06](./US-Channels-06-delete-own-channel.md)) and when the stored current channel no longer exists.
* A user who has not chosen a channel cannot reach pages that require one; they are returned here.

**Tech notes**

* Choosing a channel here is the same operation as switching
  ([US-Channels-02](./US-Channels-02-freely-switch-between-channels.md)): the id is stored on the client and sent in
  the header the gateway validates against the `channelIds` claim. No token is re-issued, because the account is
  already authenticated and the claim already lists every channel it owns.
* Creating a channel is the one case that does re-issue the token pair, since `channelIds` gains an entry
  ([US-Channels-01](./US-Channels-01-create-multiple-channels.md)). That is why the flow is shared rather than
  reimplemented here.
* The page is outside the layout for the same reason the auth pages are: it is the one screen where the user is
  authenticated but has no identity to act as yet, so every layout element that depends on the current channel — the
  sidebar's channel block, the notifications badge — would have nothing to render.
* The list comes from the same endpoint the channel switcher uses; nothing new is needed on the server.

**Links**

* [US-Auth-01 — Account creation and login](../auth/US-Auth-01-Account-creation-and-login.md)
* [US-Channels-01 — Create multiple channels](./US-Channels-01-create-multiple-channels.md)
* [US-Channels-02 — Switch between channels](./US-Channels-02-freely-switch-between-channels.md)
* [US-Channels-06 — Delete own channel](./US-Channels-06-delete-own-channel.md)
* [US-UI-UX-03 — Global layout](../ui-ux/US-UI-UX-03-Global-layout.md)

**Tasks**

BE:

* None — the page uses [US-Channels-01 Task-02](../../tasks/channels/US-Channels-01/backend/Task-02-channel-api-Implement-GET-channels-mine.md), the same endpoint the switcher lists from

FE:

* [Task-01 — Build the channel selection page](../../tasks/channels/US-Channels-07/frontend/Task-01-Build-the-channel-selection-page.md)
* [Task-02 — Send users here when no channel is chosen](../../tasks/channels/US-Channels-07/frontend/Task-02-Send-users-here-when-no-channel-is-chosen.md)
