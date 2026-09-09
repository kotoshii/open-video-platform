## US-Recommendations-02 — Similar videos on the video page

**Description**

As a registered user with a verified account, I want to see videos related to the one I'm watching next to the player,
so that I can keep watching around a topic without going back to search.

**User flows**

See similar videos — main flow:

1. User opens a video page.
2. The app asks the recommender for videos related to the one being watched.
3. The candidates are filtered down to what the user is allowed to see and cut to 20.
4. User sees the list next to the player (on the right on desktop).

See similar videos — branches:

* **Fewer than 20 related videos found** (step 3) — the list is topped up with random videos, so it always shows a full
  block.
* **Nothing to show** (step 4) — the platform has too few videos to fill the block at all; the section shows an empty
  state rather than an empty block.
* **Request fails** (step 2) — the list is a section of the page, not the page itself, so it shows its own error state
  with a retry action and the video keeps playing ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

* The video page shows a list of at most 20 videos next to the player.
* The videos are related to the one being watched.
* Related videos are found without depending on other users' behaviour, so the list is useful from the first uploads.
* When fewer than 20 usable related videos exist, the rest of the block is filled with random videos.
* The video currently being watched is never in the list.
* Videos of channels that are not available (soft deleted — see
  [US-Channels-06](../channels/US-Channels-06-delete-own-channel.md) and
  [US-Account-01](../account/US-Account-01-Delete-own-account.md)) are never returned.
* Age-restricted videos are excluded for users whose date of birth
  ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)) says they are too young.
* The list is not paginated — it is a fixed block of up to 20.
* A failure in this section does not break the video page.

**Tech notes**

* Use Gorse's item-to-item recommenders, on the same instance the feed uses
  ([US-Recommendations-01](./US-Recommendations-01-Feed.md)). Neighbours are precomputed and cached per item, so serving
  the video page is a cache read.
* Gorse v0.5 supports several item-to-item types: `tags` (common labels), `users` (common feedback), `embedding` (vector
  similarity) and `auto`. The `tags` and `embedding` types need **no interaction data**, which is why this story works
  from the start while the feed only becomes useful once people have watched something.
* Start with a content-based recommender and add a `users`-based one once there is real interaction data; several
  item-to-item recommenders can be defined side by side, so this is a configuration change rather than a rewrite.
* This depends on videos carrying labels — tags, category, language. The Video uploading epic has to capture them
  (see [project-overview.md](../../project-overview.md)); without labels the content-based path is closed and only
  embeddings remain.
* If embeddings are used, this service produces them (from title, description and tags) and Gorse only stores and
  compares the vectors. That means picking an embedding model — an external API or a local one — which is a dependency
  worth deciding before the story is picked up.
* Excluding the current video and the unavailable channels happens in the filtering step, not by trimming the result
  afterwards, so the list can still reach 20 entries.
* The random top-up is worth revisiting: same-channel or trending videos would read better than random ones next to a
  video the user chose deliberately.

**Links**

* [Gorse — algorithms](https://gorse.io/docs/master/concepts/algorithms.html)
* [Gorse v0.5 release](https://gorse.io/posts/release-0.5.html)
* [US-Auth-01 — Account creation and login](../auth/US-Auth-01-Account-creation-and-login.md)
* [US-Recommendations-01 — Feed](./US-Recommendations-01-Feed.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)
* [Figma](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=18-722&p=f&t=hZh5ti3bRSHbCDEe-0)

**Tasks**

BE:

* TODO

FE:

* TODO
