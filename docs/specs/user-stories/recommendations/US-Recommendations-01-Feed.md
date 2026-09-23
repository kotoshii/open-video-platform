## US-Recommendations-01 — Feed

**Description**

As a registered user, I want the homepage to show videos picked from what I have watched, liked
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
* Videos the channel has already watched are not shown in the feed.
* If the recommender cannot answer, the feed still returns results, using the same popularity fallback.
* Videos of channels that no longer exist are never returned. A channel scheduled for deletion is still a live
  channel, but its videos are private until the purge runs, so they are not returned either
  ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md),
  [US-Account-01](../account/US-Account-01-Delete-own-account.md)).
* Age-restricted videos are excluded for users whose date of birth
  ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)) says they are too young, and for channels whose
  "Show age-restricted content" setting is off
  ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)).
* Loading more never repeats a video already shown and never skips one.
* An empty result shows an empty state, not an error.
* Failures follow the error flow for page data ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
* On mobile the feed is a single column of cards: a full-width thumbnail, and under it the channel avatar, the title,
  the channel name, the view count and the upload date.

**Tech notes**

* Use Gorse as the candidate source. It runs as its own service with its own storage, alongside the existing Postgres
  and Redis.
* The pipeline is **candidates → filter → limit → paginate**. Gorse returns ids; this service owns the filtering, the
  popularity fallback and the ordering — which is also why a purged channel's videos disappear from the feed
  immediately, without waiting for the recommender to catch up.
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
* **No cache of our own in front of Gorse** — it already caches its results, and a second layer would only add a
  second place for them to go stale. The per-session snapshot described above is a different thing and stays: it keeps
  the scroll order stable, it does not save work.
* **The feed excludes videos the channel has already watched.** This should come from how Gorse treats watch feedback
  rather than from filtering in this service — check the Gorse configuration when the story is built. A channel with
  its history paused sends no watch feedback ([US-My-activity-01](../my-activity/US-My-activity-01-Watch-history.md)),
  so videos it watches while paused can still be recommended.
* This story depends on there being interaction data at all — watch history (My activity epic), likes (Videos epic) and
  subscriptions. Until those exist the recommender has nothing to learn from, so this story only becomes meaningful
  after them.
* Watch feedback respects the watch history settings
  ([US-My-activity-01](../my-activity/US-My-activity-01-Watch-history.md)): a channel with its history paused sends no
  watch feedback, and clearing the history — or removing one video from it — removes those watch signals from Gorse
  again.
* **Decided while writing the tasks:**
    * The channel's own videos are left out of its feed, from Gorse's candidates and the popular ones alike. Similar
      videos keep them, since there they are related by content.
    * "Most popular" means published public videos ordered by all-time view count, served by the video service, so the
      fallback works when Gorse is down.
    * A feed session's snapshot holds about 200 videos: Gorse's candidates first, then popular videos after them, with
      duplicates dropped and — while Gorse answers — the videos the channel has already watched left out. With no
      history, or with Gorse down, it is all popular videos.
    * Scrolling past the end of the snapshot, or reaching it after the snapshot has expired (an hour after its last page
      was read), simply stops the loading, with no message. The next visit to the homepage builds a new snapshot.
    * If loading more fails, the cards already shown stay and the bottom of the list shows a section error with a
      retry; only a failed first page is a full-screen error.
    * Gorse's feedback types: watch and like are positive, dislike is negative, and there is no read type — Gorse treats
      an item a user has only read as a negative example. Subscriptions reach Gorse as labels: the subscribed channel
      ids on the user, and the channel id on each video.

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

* [Task-01 — Run Gorse in Compose](../../tasks/recommendations/US-Recommendations-01/backend/Task-01-Run-Gorse-in-Compose.md)
* [Task-02 — Create recommendation-api](../../tasks/recommendations/US-Recommendations-01/backend/Task-02-Create-recommendation-api.md)
* [Task-03 — recommendation-api: Keep Gorse's items in step with videos](../../tasks/recommendations/US-Recommendations-01/backend/Task-03-recommendation-api-Keep-Gorses-items-in-step-with-videos.md)
* [Task-04 — recommendation-api: Send watches to Gorse](../../tasks/recommendations/US-Recommendations-01/backend/Task-04-recommendation-api-Send-watches-to-Gorse.md)
* [Task-05 — recommendation-api: Send likes and dislikes to Gorse](../../tasks/recommendations/US-Recommendations-01/backend/Task-05-recommendation-api-Send-likes-and-dislikes-to-Gorse.md)
* [Task-06 — recommendation-api: Send subscriptions to Gorse](../../tasks/recommendations/US-Recommendations-01/backend/Task-06-recommendation-api-Send-subscriptions-to-Gorse.md)
* [Task-07 — video-api: List the most viewed videos over gRPC](../../tasks/recommendations/US-Recommendations-01/backend/Task-07-video-api-List-the-most-viewed-videos-over-gRPC.md)
* [Task-08 — recommendation-api: Build the feed snapshot](../../tasks/recommendations/US-Recommendations-01/backend/Task-08-recommendation-api-Build-the-feed-snapshot.md)
* [Task-09 — recommendation-api: Implement GET /feed](../../tasks/recommendations/US-Recommendations-01/backend/Task-09-recommendation-api-Implement-GET-feed.md)

FE:

* [Task-10 — Build the homepage feed](../../tasks/recommendations/US-Recommendations-01/frontend/Task-10-Build-the-homepage-feed.md)
