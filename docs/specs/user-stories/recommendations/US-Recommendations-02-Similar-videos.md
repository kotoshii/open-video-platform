## US-Recommendations-02 — Similar videos on the video page

**Description**

As a registered user, I want to see videos related to the one I'm watching next to the player,
so that I can keep watching around a topic without going back to search.

**User flows**

See similar videos — main flow:

1. User opens a video page.
2. The app asks for videos related to the one being watched.
3. Related videos are found from the watched video's title, description and tags, limited to what the user is allowed
   to see, up to 20.
4. User sees the list next to the player (on the right on desktop).

See similar videos — branches:

* **Fewer than 20 related videos found** (step 3) — the list shows what there is; nothing is added to fill the block.
* **Nothing to show** (step 4) — no related videos are found at all; the section shows an empty state rather than an
  empty block.
* **Request fails** (step 2) — the list is a section of the page, not the page itself, so it shows its own error state
  with a retry action and the video keeps playing ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

* The video page shows a list of at most 20 videos next to the player.
* The videos are related to the one being watched, judged by title, description and tags.
* A video with only a title — no description and no tags — still gets related videos, found from its title.
* Related videos are found without depending on other users' behaviour, so the list is useful from the first uploads.
* When fewer than 20 related videos are found, the list is shorter; it is never padded with unrelated videos.
* The video currently being watched is never in the list.
* Videos of channels that no longer exist are never returned. A channel scheduled for deletion is still a live
  channel, so its videos appear as usual until the purge runs
  ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md),
  [US-Account-01](../account/US-Account-01-Delete-own-account.md)).
* Age-restricted videos are excluded for users whose date of birth
  ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)) says they are too young, and for channels whose
  "Show age-restricted content" setting is off
  ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)).
* The list is not paginated — it is a fixed block of up to 20.
* A failure in this section does not break the video page.
* On mobile the similar videos are not beside the player: they follow the video's row of actions as a single column of
  cards ([US-Videos-01](../videos/US-Videos-01-Watch-videos.md)).

**Tech notes**

* **Similar videos come from Elasticsearch's `more_like_this` query, not from Gorse.** It takes the watched video's
  title, description and tags, picks the terms most specific to it — frequent in this video, rare across all videos —
  and returns the videos that match those terms best.
* Why not Gorse: the title is the only required field, while tags and description are optional. A tag-based
  recommender finds nothing for a video without tags; `more_like_this` works from whatever text a video has. It also
  weights the words by itself — "tutorial", found in thousands of videos, counts for little, while a rare word counts
  for a lot — and it needs no watch data, so it works from the first uploads.
* It runs in the Search service, which owns the index ([US-Search-01](../search/US-Search-01-Search-videos.md)). The
  story stays in the Recommendations epic because that is where it sits for the user. Gorse keeps the feed
  ([US-Recommendations-01](./US-Recommendations-01-Feed.md)).
* The query points at the watched video by id — `like: [{ "_index": ..., "_id": ... }]` — so no text has to be sent;
  Elasticsearch reads the stored document. The watched video itself is left out of the results by default
  (`include: false`).
* Query the title and description through their language sub-fields as well
  ([US-Search-01](../search/US-Search-01-Search-videos.md)), so that different forms of the same Ukrainian word count
  as a match.
* **The defaults return nothing for this data, so set them explicitly:**
    * `min_term_freq` defaults to 2 — a word must appear twice in the video's own text to count. A title word usually
      appears once, so titles would be ignored completely. Use 1.
    * `min_doc_freq` defaults to 5 — a word must appear in at least 5 videos. On a small platform that rules out almost
      every word. Use 1, and raise it once there are enough videos for typos and one-off words to become noise.
* The age filters go into the same query, as a `bool` filter around the `more_like_this` clause, so the 20 results are
  20 the viewer can see rather than 20 that are trimmed afterwards. Private and accessible-by-link videos are never in
  the index to begin with ([US-Videos-03](../videos/US-Videos-03-Manage-own-videos.md)).
* The query runs on each page view instead of being precomputed. One query against a small index is cheap; if it ever
  shows up as slow, cache the result per video for a short time.
* **The list is exactly what the query returns** — no top-up from another source, whether random, same-channel or
  popular. A short list next to a video is honest; a padded one mixes unrelated videos in with related ones and gives
  the reader no way to tell them apart.
* Not now, but possible later: "people who watched this also watched" from Gorse's `users` item-to-item recommender,
  once there is real watch data. Embeddings are not used.

**Links**

* [Elasticsearch — more_like_this query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html)
* [US-Auth-01 — Account creation and login](../auth/US-Auth-01-Account-creation-and-login.md)
* [US-Recommendations-01 — Feed](./US-Recommendations-01-Feed.md)
* [US-Search-01 — Search videos](../search/US-Search-01-Search-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)
* [Figma](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=18-722&p=f&t=hZh5ti3bRSHbCDEe-0)

**Tasks**

BE:

* TODO

FE:

* TODO
