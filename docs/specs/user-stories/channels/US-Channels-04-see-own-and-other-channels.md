## US-Channels-04 — See own and other users' channels

**Description**

As an authenticated user, I want to open my own channel page and other users' channel pages, so
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
* A channel with no subscribers shows no subscriber count, rather than "0 subscribers".
* The video count always matches the list below it for the viewer looking at the page: a visitor's count covers the
  published, public videos they can actually see, while the author's own count covers everything in their list.
* Sorting offers newest, most viewed and oldest.
* The search input is part of the page but its behaviour belongs to
  [US-Search-03](../search/US-Search-03-Search-videos-on-channel-page.md), not to this story.

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

* On the user's own channel the list shows **every** video the channel has: published ones, private ones, ones only
  accessible by link, ones still uploading or processing, and ones whose upload failed or expired
  ([US-Videos-05](../videos/US-Videos-05-Upload-videos.md)).
* Each of those carries its state, so the author can tell at a glance what is published and what is not, and clicking
  one that is not yet published opens its uploading page rather than the watch page.
* On someone else's channel the list shows only published, public videos — private and accessible-by-link videos are
  absent ([US-Videos-03](../videos/US-Videos-03-Manage-own-videos.md)), and so are age-restricted ones for a viewer
  too young for them or browsing with "Show age-restricted content" off
  ([US-Channels-03](./US-Channels-03-current-channel-settings.md)).
* On desktop, hovering a video shows a 3-dot button on the video component; on mobile it is always rendered.
* The 3-dot button is shown only on the user's own channel.
* The contents of the 3-dot menu are video management actions — out of scope here, mentioned for context.
* The video list is paginated, with page controls at the bottom; it does not load more on scroll.

Mobile:

* The header shows the avatar, the channel name, the subscriber and video counts and the "Show description" button, with
  a full-width subscribe button under them on other users' channels.
* The videos are a single column of cards, each with the thumbnail on the left and the title, views and date on the
  right.
* The search input is hidden by default to save space; a search icon next to the sort buttons reveals it below them
  ([US-Search-03](../search/US-Search-03-Search-videos-on-channel-page.md)).
* The 3-dot button is always visible on the user's own videos, and never shown on other channels.

**Tech notes**

* Own and other users' channels are the same page; ownership is a flag that toggles the edit affordances, the subscribe
  button and the video menu — not a separate route or component tree.
* Ownership is decided by comparing the page's channel id with the current channel id sent in the header
  ([US-Channels-02](./US-Channels-02-freely-switch-between-channels.md)), so switching channels changes which channel
  page is "own" without any re-authentication.
* The page pulls from several services — channel info from Channels, the video list from Videos, the subscription state
  and subscriber count from Subscriptions.
* **The video count is read live over gRPC, not kept as a denormalized counter.** It has to apply the same filter as
  the list it sits above — visibility, and the viewer's age — so a stored number would need one counter per audience
  to stay honest. A `COUNT(*)` over an index on the channel id, with the same `WHERE` clause the listing uses, is
  more than enough at this scale, and it is what makes the count and the list agree by construction rather than by
  a worker keeping up.
* The subscriber count stays a denormalized counter maintained by `subscriber-count-worker`
  ([US-Subscriptions-01](../subscriptions/US-Subscriptions-01-Subscribe-to-other-channels.md)) — it has no per-viewer
  filter, so none of the above applies to it.

**Links**

* [Figma mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=43-510&t=mtG4BOQzSN0LeGaK-0)
* [US-Channels-02 — Switch between channels](./US-Channels-02-freely-switch-between-channels.md)
* [US-Channels-03 — Current channel settings](./US-Channels-03-current-channel-settings.md)

**Tasks**

BE:

* TODO

FE:

* TODO
