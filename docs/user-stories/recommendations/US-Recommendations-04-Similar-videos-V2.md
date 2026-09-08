## US-Recommendations-04 — Similar videos (V2)

**Description**

As a registered user with a verified account, I want the videos listed next to the one I'm watching to actually be
related to it, so that I can keep watching around a topic I'm interested in.

**This story states only what changes from [US-Recommendations-02](./US-Recommendations-02-Similar-videos-V1.md).** The
placement, the limit of 20, the filtering, the empty state and the error handling stay exactly as they are there; only
the candidate source changes.

**User flows**

See similar videos — changed step:

* Step 2 of the V1 flow — instead of picking random videos, the app asks the recommender for videos related to the one
  being watched.

See similar videos — new branch:

* **Fewer than 20 related videos found** — the list is topped up with random videos, so it always shows a full block.

**Acceptance criteria**

* The list contains videos related to the one being watched, not arbitrary ones.
* When the recommender returns fewer than 20 usable videos, the rest are filled with random ones.
* Related videos are found without depending on other users' behaviour, so the list is useful from the first uploads.
* Everything else is unchanged from V1: the placement, the limit of 20, the exclusion of the current video, the filters
  and the error handling.

**Tech notes**

* Use Gorse's item-to-item recommenders, the same instance the feed uses
  ([US-Recommendations-03](./US-Recommendations-03-Feed-V2.md)). Neighbours are precomputed and cached per item, so
  serving the video page is a cache read.
* Gorse v0.5 supports several item-to-item types: `tags` (common labels), `users` (common feedback), `embedding` (vector
  similarity) and `auto`. The `tags` and `embedding` types need **no interaction data**, which is why this story can
  work from the start while the feed cannot.
* Start with a content-based recommender and add a `users`-based one once there is real interaction data; several
  item-to-item recommenders can be defined side by side, so this is a configuration change rather than a rewrite.
* This depends on videos carrying labels — tags, category, language. The Video uploading epic has to capture them
  (see [project-overview.md](../../project-overview.md)); without labels the content-based path is closed and only
  embeddings remain.
* If embeddings are used, this service produces them (from title, description and tags) and Gorse only stores and
  compares the vectors. That means picking an embedding model — an external API or a local one — which is a dependency
  worth deciding before the story is picked up.
* The random top-up is worth revisiting: same-channel or trending videos would read better than random ones next to a
  video the user chose deliberately.

**Links**

* [Gorse — algorithms](https://gorse.io/docs/master/concepts/algorithms.html)
* [Gorse v0.5 release](https://gorse.io/posts/release-0.5.html)
* [US-Recommendations-02 — Similar videos (V1)](./US-Recommendations-02-Similar-videos-V1.md)
* [US-Recommendations-03 — Feed (V2)](./US-Recommendations-03-Feed-V2.md)

**Tasks**

BE:

* TODO

FE:

* TODO
