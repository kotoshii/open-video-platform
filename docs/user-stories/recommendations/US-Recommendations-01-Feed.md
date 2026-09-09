## US-Recommendations-01 — Feed

**Description**

As a registered user with a verified account, I want the homepage to show videos picked from what I have watched, liked
and disliked, so that I find something worth watching without searching for it.

**User flows**

Open the feed — main flow:

1. User opens the homepage.
2. The app requests the feed for the channel the user is currently acting as.
3. The recommender returns candidates based on that channel's watch, like and dislike history.
4. The candidates are filtered down to what the user is allowed to see.
5. User sees a list of videos, and more are loaded as they scroll.

Open the feed — branches:

* **Channel has no history yet** (step 3) — a newly created channel has nothing to recommend from; the feed shows the
  most popular videos first.
* **Recommender unavailable** (step 3) — the feed falls back to the most popular videos instead of failing; a broken
  recommender must not take the homepage down with it.
* **Nothing to show** (step 5) — every candidate was filtered out, or the platform has no videos yet; the page shows an
  empty state instead of a blank list.
* **Request fails** (step 2) — the feed is page data, so the failure is shown as a full-screen error state with a retry
  action ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

* The homepage shows a list of videos to an authenticated user, loading more as they scroll — infinite scroll, not
  page controls.
* The feed reflects the current channel's watch, like and dislike history.
* A channel with no history gets the most popular videos first.
* If the recommender cannot answer, the feed still returns results, using the same popularity fallback.
* Videos of channels that are not available (soft deleted — see
  [US-Channels-06](../channels/US-Channels-06-delete-own-channel.md) and
  [US-Account-01](../account/US-Account-01-Delete-own-account.md)) are never returned.
* Age-restricted videos are excluded for users whose date of birth
  ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)) says they are too young.
* Loading more never repeats a video already shown and never skips one.
* An empty result shows an empty state, not an error.
* Failures follow the error flow for page data ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Tech notes**

* Use Gorse as the candidate source. It runs as its own service with its own storage, alongside the existing Postgres
  and Redis.
* The pipeline is **candidates → filter → limit → paginate**. Gorse returns ids; this service owns the filtering, the
  popularity fallback and the ordering — which is also why a soft-deleted channel disappears from the feed immediately,
  without waiting for the recommender to catch up.
* Filtering by visibility happens at serve time against the current state, never by trusting what the recommender has
  indexed.
* The recommender's "user" is the **channel**, not the account — an account can act as several channels
  ([US-Channels-02](../channels/US-Channels-02-freely-switch-between-channels.md)) and their tastes should not be mixed.
* Feedback reaches Gorse through Kafka consumers on the events that already exist — watched, liked, disliked,
  subscribed. Consumers must be idempotent and deduplicate, the same way the channel-updated consumers do
  ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)).
* Videos have to be pushed to Gorse as items when published, updated and removed, otherwise it can only recommend what
  it has seen.
* Recommendations plus infinite scroll need a result set that is stable for the duration of a feed session: fix it on
  the first page and page over it, rather than re-asking the recommender per batch and hoping the order holds.
* Cold start is the normal state at first, not an edge case: with no interaction data the recommender returns little or
  nothing, and the popularity fallback carries the feed. Build the fallback as a proper source, not as an error path.
* Whether recommendations are cached per channel, and for how long, needs a decision — Gorse already caches its own
  results, so a second cache may be redundant.
* Whether the feed excludes videos the channel has already watched needs a decision.
* This story depends on there being interaction data at all — watch history (My activity epic), likes (Videos epic) and
  subscriptions. Until those exist the recommender has nothing to learn from, so this story only becomes meaningful
  after them.

**Links**

* [Gorse](https://gorse.io/)
* [US-Auth-01 — Account creation and login](../auth/US-Auth-01-Account-creation-and-login.md)
* [US-Channels-02 — Switch between channels](../channels/US-Channels-02-freely-switch-between-channels.md)
* [US-Channels-03 — Current channel settings](../channels/US-Channels-03-current-channel-settings.md)
* [US-Recommendations-02 — Similar videos](./US-Recommendations-02-Similar-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)
* [Figma](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=4-83&p=f&t=hZh5ti3bRSHbCDEe-0)

**Tasks**

BE:

* TODO

FE:

* TODO
