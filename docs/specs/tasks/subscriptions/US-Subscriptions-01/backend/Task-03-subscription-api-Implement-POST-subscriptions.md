## subscription-api: Implement POST /subscriptions

Needs: [Task-01 — Migrate subscription-api to the new structure](Task-01-Migrate-subscription-api-to-the-new-structure.md)

`POST /subscriptions` — body `{ channelId }`

Main flow:

1. Take the subscriber from the `Channel-ID` header the gateway set.
2. In one transaction, insert the pair and write the subscription-created event to the outbox.

Branch — the subscription already exists:

1. Answer as a success and write no second event.

Branch — the channel is the one acting:

1. Reject with its code. A channel cannot subscribe to itself; another channel of the same account is a separate
   identity and is subscribed to like any other.

Why: the event is consumed by three services — the count worker, notifications and the recommender — so it is written
through the outbox rather than sent inline, and a duplicate insert must not produce a second one.
