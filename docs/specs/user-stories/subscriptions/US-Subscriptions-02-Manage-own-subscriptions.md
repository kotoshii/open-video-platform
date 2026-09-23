## US-Subscriptions-02 — Manage own subscriptions

**Description**

As a registered user, I want to see every channel I'm subscribed to and unsubscribe from the
ones I no longer want, so that my subscriptions stay the way I want them.

**User flows**

See the list — main flow:

1. User opens the subscriptions page and clicks "View all"
   ([US-Subscriptions-03](./US-Subscriptions-03-Subscription-content-page.md)).
2. User sees every channel the current channel is subscribed to, most recently subscribed first.
3. Each row shows the channel's avatar, its name, its subscriber count and its description, cut to two lines.
4. Above the list there is a search input, and at the top left a button back to the videos view.

Open a channel:

1. User hovers over a subscribed row; an icon next to the channel name shows that it opens in a new tab.
2. User clicks the row.
3. The channel page opens in a new tab.

Unsubscribe:

1. User hovers over a row and the "Unsubscribe" button appears.
2. User clicks it.
3. The row becomes semi-transparent, its avatar turns monochrome, and the button changes to "Subscribe" and stays
   visible rather than appearing only on hover.
4. The row can no longer be clicked.
5. The row stays in the list, so an accidental unsubscribe can be undone, until the list is loaded again.

Subscribe again:

1. On an unsubscribed row, user clicks "Subscribe".
2. The row returns to its normal look and becomes clickable again.

Search:

1. User types into the search input.
2. The list is filtered as they type, by channel name and description.

Branches:

* **The list is loaded again** — by reloading the page or opening it again; unsubscribed rows are gone.
* **No subscriptions** — the page shows an empty state.
* **Nothing matches the search** — the list shows an empty state until the search is changed or cleared.
* **The list fails to load** — a full-page error state with a retry action
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
* **Unsubscribing or subscribing again fails** — the row returns to its previous state and the default toast
  behaviour applies.

**Acceptance criteria**

* The page lists every subscription of the current channel, all at once, with no pagination.
* The list is ordered by subscription date, most recent first.
* Each row shows the avatar, the channel name, the subscriber count and the description truncated to two lines.
* A channel with no subscribers shows no subscriber count.
* On desktop, hovering over a subscribed row shows the "Unsubscribe" button and an icon marking that the channel opens
  in
  a new tab.
* On mobile, the subscribe and unsubscribe buttons are always visible, as icon-only buttons.
* Clicking a subscribed row opens that channel's page in a new tab.
* Unsubscribing takes effect immediately, with no confirmation.
* An unsubscribed row stays in place: semi-transparent, with a monochrome avatar, not clickable, and with its
  "Subscribe" button always visible.
* Subscribing again from that row restores the row.
* Unsubscribed rows are gone the next time the list is loaded, whether by reloading or by opening the page again.
* The search filters the list as the user types, by channel name and description, entirely on the client; there is no
  submit button.
* A button at the top left leads back to the videos view
  ([US-Subscriptions-03](./US-Subscriptions-03-Subscription-content-page.md)).

**Tech notes**

* The whole list arrives in one request, and that is what makes the search a pure client-side filter: there is nothing
  to ask the server, so filtering on every keystroke costs nothing and a submit button would do nothing.
* The page must fetch the list every time it is opened rather than reuse a cached copy. A cached list from before an
  unsubscribe would bring the channel back as if it were still subscribed.
* Unsubscribed rows are purely client state. The server has already removed the subscription; the page simply keeps the
  row it rendered, which is why the row disappears on the next fetch without any extra work.
* One request for everything is right at this scale. For a channel with thousands of subscriptions, the rendered list
  becomes the limit before the payload does — the fix at that point is a virtualised list, not pagination, since the
  search needs every row.
* A channel scheduled for deletion is still live, so it stays in the list until its purge removes the subscription
  ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)).
* Unsubscribing and subscribing again here emit the same events as
  [US-Subscriptions-01](./US-Subscriptions-01-Subscribe-to-other-channels.md), including the subscription's creation
  time.

**Links**

* [US-Channels-06 — Delete own channel](../channels/US-Channels-06-delete-own-channel.md)
* [US-Subscriptions-01 — Subscribe to other channels](./US-Subscriptions-01-Subscribe-to-other-channels.md)
* [US-Subscriptions-03 — Subscription content page](./US-Subscriptions-03-Subscription-content-page.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* None — the page uses [US-Subscriptions-03 Task-02](../../tasks/subscriptions/US-Subscriptions-03/backend/Task-02-subscription-api-Implement-GET-subscriptions-current.md), the same endpoint the avatar row lists from

FE:

* [Task-01 — Build the full subscriptions list](../../tasks/subscriptions/US-Subscriptions-02/frontend/Task-01-Build-the-full-subscriptions-list.md)
