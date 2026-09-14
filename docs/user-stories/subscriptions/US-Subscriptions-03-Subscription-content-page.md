## US-Subscriptions-03 — Subscription content page

**Description**

As a registered user with a verified account, I want one page where I can move between the channels I'm subscribed to
and browse each one's videos, so that I can catch up on the channels I follow without visiting them one by one.

**User flows**

Browse — main flow:

1. User opens the subscriptions page from the sidebar.
2. At the top, user sees a horizontally scrollable row with the avatars of every channel they are subscribed to, most
   recently subscribed first, and a "View all" button at the end of it.
3. The first channel in the row is selected and marked with an outline.
4. Below the row, the selected channel's name is shown next to a "View channel" button.
5. Below that come the selected channel's videos, in the same layout as a channel page: the Newest, Most viewed and
   Oldest sort buttons, a search input, and the video list with page controls.

Pick a channel:

1. User hovers over an avatar and a tooltip shows the channel's name.
2. User clicks the avatar.
3. That channel becomes selected and its name replaces the one in the label.
4. Its videos load, with the sort back on Newest, the search cleared and the first page shown.

Other actions:

* "View channel" opens the selected channel's page.
* "View all" opens the full subscriptions list
  ([US-Subscriptions-02](./US-Subscriptions-02-Manage-own-subscriptions.md)).
* Searching finds videos within the selected channel, exactly as on its channel page
  ([US-Search-03](../search/US-Search-03-Search-videos-on-channel-page.md)).

On mobile:

1. The avatar row scrolls horizontally, with "View all" at its end.
2. The videos are a single column of cards, each with the thumbnail on the left and the title, views and date on the
   right.
3. The search input is hidden by default to save space; a search icon next to the sort buttons reveals it below them.

Branches:

* **No subscriptions** — an empty state replaces the avatar row and the videos.
* **The selected channel has no videos** — the video section shows an empty state.
* **The page is reloaded** — the same channel stays selected.
* **The channel in the address is no longer a subscription** — it was unsubscribed elsewhere, or it has been deleted;
  the first channel in the row is selected instead.
* **The page fails to load** — a full-page error state with a retry action
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
* **The videos fail to load** — the video section shows its own error state with a retry action, and the avatar row
  keeps working.

**Acceptance criteria**

* The page shows a horizontally scrollable row with an avatar for every subscription of the current channel, most
  recently subscribed first, ending with "View all".
* The first channel is selected by default, and the selected avatar is outlined.
* Hovering over an avatar shows the channel's name in a tooltip.
* Clicking an avatar selects that channel and loads its videos.
* The selected channel's name and a "View channel" button sit between the avatar row and the videos.
* The video section looks and behaves like the channel page's video list: Newest, Most viewed and Oldest, a search
  within the channel, and page controls at the bottom
  ([US-Channels-04](../channels/US-Channels-04-see-own-and-other-channels.md)).
* Selecting another channel resets the sort to Newest, clears the search and returns to the first page.
* The selected channel is kept in the page address, so reloading or sharing the page keeps it selected.
* Videos have no 3-dot menu.
* On mobile, the videos are a single column of cards, and the search input stays hidden until the search icon is
  pressed.

**Tech notes**

* The video section reuses the channel page's video list and its search
  ([US-Channels-04](../channels/US-Channels-04-see-own-and-other-channels.md),
  [US-Search-03](../search/US-Search-03-Search-videos-on-channel-page.md)); nothing new is needed on the server for it.
* That search is the server-side channel search, submitted with Enter or its button. It is not the client-side filter
  of [US-Subscriptions-02](./US-Subscriptions-02-Manage-own-subscriptions.md), and the two should not be confused.
* Reusing the channel listing also means inheriting its visibility rules: private and accessible-by-link videos never
  appear, and age-restricted ones are filtered by the viewer's date of birth
  ([US-Videos-03](../videos/US-Videos-03-Manage-own-videos.md)).
* There are no 3-dot menus because the channel being browsed is never the acting channel — a channel cannot subscribe to
  itself.
* The avatar row and the list in US-Subscriptions-02 are the same data — the current channel's subscriptions, most
  recent first — and can come from the same request.
* Soft-deleted channels are left out of the row ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)).
* The page shows one channel at a time rather than a merged timeline of everything the user follows. That keeps it a
  set of existing per-channel queries. A merged, date-sorted feed across every subscription would be a separate problem
  — fan-out — and a separate design.

**Links**

* [US-Channels-04 — See own and other channels](../channels/US-Channels-04-see-own-and-other-channels.md)
* [US-Search-03 — Search videos on the channel page](../search/US-Search-03-Search-videos-on-channel-page.md)
* [US-Subscriptions-01 — Subscribe to other channels](./US-Subscriptions-01-Subscribe-to-other-channels.md)
* [US-Subscriptions-02 — Manage own subscriptions](./US-Subscriptions-02-Manage-own-subscriptions.md)
* [US-Videos-03 — Manage own videos](../videos/US-Videos-03-Manage-own-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
