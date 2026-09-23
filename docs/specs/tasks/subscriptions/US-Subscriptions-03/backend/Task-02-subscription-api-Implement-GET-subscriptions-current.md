## subscription-api: Implement GET /subscriptions/current

Needs: [Task-01 — subscription-api: Keep the subscribed channels' details fresh](Task-01-subscription-api-Keep-the-subscribed-channels-details-fresh.md)

`GET /subscriptions/current`

Returns every channel the acting channel is subscribed to — id, name, avatar, description and subscriber count — most
recently subscribed first, in one response with no paging.

Why: one request for everything is what makes the search on the subscriptions page a pure client-side filter
([US-Subscriptions-02](../../../../user-stories/subscriptions/US-Subscriptions-02-Manage-own-subscriptions.md)), and
the same response fills the avatar row here. For a channel with thousands of subscriptions the rendered list becomes
the limit long before the payload does, and the answer then is a virtualised list rather than paging — because the
search needs every row.
