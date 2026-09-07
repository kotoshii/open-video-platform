## US-Channels-04 — See own and other users' channels

**Description**

As an authenticated user with a verified account, I want to open my own channel page and other users' channel pages, so
that I can browse a channel's videos and info, with the editing and management actions available only on my own channel.

**User flows**

Own channel:

1. User clicks their channel name in the sidebar.
2. The channel page opens.
3. User sees:
    * **Header** — avatar, channel name, subscriber count, video count and a "Show description" button; the subscribe
      button is not rendered on the user's own channel.
    * **Sorting** (newest, most viewed, oldest) and a search input under the header.
    * **List of videos**.

Someone else's channel — the same page, with the following differences:

1. The avatar, channel name and description have no edit buttons.
2. The subscribe button is rendered, with the text matching the current subscription state.
3. Videos have no 3-dot menu button.

**Acceptance criteria**

Header:

* The header shows the avatar, channel name, subscriber count, video count and the "Show description" button.
* Sorting offers newest, most viewed and oldest.
* The search input is part of the page but its behaviour is out of scope here — see the Search epic in
  [project-overview.md](../../project-overview.md).

Avatar (own channel only):

* On desktop, hovering it shows a pen ("edit") icon.
* On mobile, a small edit button is always shown on it.
* Clicking or tapping it opens the settings page on the Channel tab
  ([US-Channels-03](./US-Channels-03-current-channel-settings.md)).
* The edit affordance is not rendered on someone else's channel.

Channel name (own channel only):

* On desktop, hovering it shows an edit icon; on mobile the edit button is always visible.
* Clicking or tapping it opens the settings page on the Channel tab.
* The edit affordance is not rendered on someone else's channel.

Description:

* The "Show description" button opens a modal (desktop) or a drawer (mobile) with the description set by the channel
  owner.
* On the user's own channel the modal/drawer has an edit button that opens the settings page on the Channel tab; on
  someone else's channel it does not.

Subscribe button:

* Rendered on other users' channels, with the text matching the state — "Subscribed" when already subscribed.
* Not rendered at all on the user's own channel.

Videos:

* On desktop, hovering a video shows a 3-dot button on the video component; on mobile it is always rendered.
* The 3-dot button is shown only on the user's own channel.
* The contents of the 3-dot menu are video management actions — out of scope here, mentioned for context.

**Tech notes**

* Own and other users' channels are the same page; ownership is a flag that toggles the edit affordances, the subscribe
  button and the video menu — not a separate route or component tree.
* Ownership is decided by comparing the page's channel id with the current channel id sent in the header
  ([US-Channels-02](./US-Channels-02-freely-switch-between-channels.md)), so switching channels changes which channel
  page is "own" without any re-authentication.
* The page pulls from several services — channel info from Channels, the video list from Videos, the subscription state
  and subscriber count from Subscriptions. Whether the counts are read live or kept as denormalized counters updated by
  events needs a decision.

**Links**

* [Figma mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=43-510&t=mtG4BOQzSN0LeGaK-0)
* [US-Channels-02 — Switch between channels](./US-Channels-02-freely-switch-between-channels.md)
* [US-Channels-03 — Current channel settings](./US-Channels-03-current-channel-settings.md)

**Tasks**

BE:

* TODO

FE:

* TODO
