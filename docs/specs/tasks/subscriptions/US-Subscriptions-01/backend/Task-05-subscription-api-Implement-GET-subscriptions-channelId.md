## subscription-api: Implement GET /subscriptions/{channelId}

Needs: [Task-03 — subscription-api: Implement POST /subscriptions](Task-03-subscription-api-Implement-POST-subscriptions.md)

`GET /subscriptions/{channelId}`

Answers whether the acting channel is subscribed to that channel.

Why: the state is read from the subscription rows rather than inferred from any counter, which is what keeps the button
right while the subscriber count is still catching up — one indexed lookup on the pair, cheap enough for every channel
and video page.
