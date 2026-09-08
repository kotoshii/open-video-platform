## US-Recommendations-03 — Feed (V2)

**Description**

As a registered user with a verified account, I want the homepage feed to be based on what I have watched, liked and
disliked, so that it shows me videos I am actually interested in.

**This story states only what changes from [US-Recommendations-01](./US-Recommendations-01-Feed-V1.md).** The page, the
filtering, the pagination, the empty state and the error handling stay exactly as they are there; only the candidate
source changes.

**User flows**

Open the feed — changed step:

* Step 2 of the V1 flow — instead of picking random videos, the app asks the recommender for videos for the current
  channel, based on its watch, like and dislike history.

Open the feed — new branches:

* **User has no history yet** — a newly created channel has nothing to recommend from; the feed falls back to the most
  popular videos first.
* **Recommender unavailable** — the feed falls back to the most popular videos rather than showing an error; a broken
  recommender must not take the homepage down with it.

**Acceptance criteria**

* The feed reflects the current channel's watch, like and dislike history.
* A channel with no history gets the most popular videos first.
* If the recommender cannot answer, the feed still returns results, using the same popularity fallback.
* Everything else is unchanged from V1: the filters, the "no repeats and no skips while paging" rule, the response
  shape, the empty state and the error handling.

**Tech notes**

* Use Gorse as the candidate source. It runs as its own service with its own storage, alongside the existing Postgres
  and Redis.
* The recommender's "user" is the **channel**, not the account — an account can act as several channels
  ([US-Channels-02](../channels/US-Channels-02-freely-switch-between-channels.md)) and their tastes should not be mixed.
* Feedback reaches Gorse through Kafka consumers on the events that already exist — watched, liked, disliked,
  subscribed. Consumers must be idempotent and deduplicate, the same way the channel-updated consumers do
  ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)).
* Videos have to be pushed to Gorse as items when published, updated and removed, otherwise it can only recommend what
  it has seen.
* Gorse is a candidate source, not the feed. It returns ids; this service still owns filtering, the popularity fallback
  and the ordering — which is also why a soft-deleted channel disappears from the feed immediately, without waiting for
  the recommender to catch up.
* Cold start is the normal state at first, not an edge case: with no interaction data the recommender returns little or
  nothing, and the popularity fallback carries the feed. Build it as a proper source, not as an error path.
* Whether recommendations are cached per channel, and for how long, needs a decision — Gorse already caches its own
  results, so a second cache may be redundant.

**Links**

* [Gorse](https://gorse.io/)
* [US-Channels-02 — Switch between channels](../channels/US-Channels-02-freely-switch-between-channels.md)
* [US-Channels-03 — Current channel settings](../channels/US-Channels-03-current-channel-settings.md)
* [US-Recommendations-01 — Feed (V1)](./US-Recommendations-01-Feed-V1.md)
* [US-Recommendations-04 — Similar videos (V2)](./US-Recommendations-04-Similar-videos-V2.md)

**Tasks**

BE:

* TODO

FE:

* TODO
