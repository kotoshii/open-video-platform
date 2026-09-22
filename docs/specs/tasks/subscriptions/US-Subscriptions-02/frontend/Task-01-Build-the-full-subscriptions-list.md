## Build the full subscriptions list

Needs: [US-Subscriptions-03 Task-02 — subscription-api: Implement GET /subscriptions/current](../../US-Subscriptions-03/backend/Task-02-subscription-api-Implement-GET-subscriptions-current.md),
[US-Subscriptions-01 Task-07 — Add the subscribe button](../../US-Subscriptions-01/frontend/Task-07-Add-the-subscribe-button.md)

Build the view behind "View all": every subscription of the acting channel in one list, most recently subscribed first,
each row with the avatar, the name, the subscriber count and the description cut to two lines. Above it a search input,
and at the top left a button back to the videos view.

Main flow:

1. Typing filters the list as the user types, by name and description, entirely on the client.
2. Hovering a row shows "Unsubscribe" and an icon marking that the channel opens in a new tab; on mobile the buttons
   are always visible, as icons.
3. Clicking a subscribed row opens that channel's page in a new tab.

Branch — the user unsubscribes:

1. The row stays where it is, semi-transparent with a monochrome avatar, no longer clickable, and its button becomes
   "Subscribe" and stays visible. Clicking it subscribes again and restores the row.

Branch — the page is opened or reloaded:

1. The list is fetched again, and the unsubscribed rows are gone.

Branch — the list fails to load:

1. A full-page error state with a retry.

Why: the whole list arrives in one request, which is what makes the search a client-side filter with nothing to submit.
The list is fetched on every visit rather than reused from the cache — a cached copy from before an unsubscribe would
bring the channel back as though it were still subscribed.
