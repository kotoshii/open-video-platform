## Build the subscriptions page

Needs: [Task-02 — subscription-api: Implement GET /subscriptions/current](../backend/Task-02-subscription-api-Implement-GET-subscriptions-current.md),
[US-Search-03 Task-02 — Add the search input to the channel video list](../../../search/US-Search-03/frontend/Task-02-Add-the-search-input-to-the-channel-video-list.md)

Build the page the sidebar's Subscriptions item opens: a horizontally scrollable row of the subscribed channels'
avatars, most recent first, ending with "View all"; under it the selected channel's name and a "View channel" button;
and under that its videos, rendered by the channel page's video list and its search.

Main flow:

1. The first channel is selected and outlined; hovering an avatar shows that channel's name.
2. Choosing another selects it, loads its videos, resets the sort to Newest, clears the search and returns to page one.
3. The selected channel is kept in the address, so a reload keeps it.

Branch — the channel in the address is no longer a subscription:

1. The first channel in the row is selected instead.

Branch — there are no subscriptions:

1. An empty state replaces the row and the videos.

Branch — the videos fail to load:

1. The video section shows its own error state with a retry, and the avatar row keeps working.

Why: the page shows one channel at a time rather than a merged timeline, which keeps it a set of queries that already
exist — a date-sorted feed across every subscription is fan-out, a different problem and a different design.
