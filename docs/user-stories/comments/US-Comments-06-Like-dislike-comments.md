## US-Comments-06 — Like/dislike comments and replies

**Description**

As a registered user with a verified account, I want to like or dislike comments and replies, so that I can show what I
agree with and help the good ones surface.

**User flows**

Rate a comment — main flow:

1. User sees the like and dislike buttons, each with its count, under every comment and reply.
2. User clicks "like".
3. The button shows as active and the count goes up straight away.
4. The rate is recorded for the channel the user is currently acting as.

Rate a comment — branches:

* **Removing a rate** (step 2) — clicking an active like or dislike again removes it; the button goes inactive and the
  count goes back down.
* **Switching a rate** (step 2) — clicking "dislike" on a comment that is already liked moves the rate: the like count
  goes down and the dislike count goes up.
* **Reloading the page** (after step 4) — the user still sees their own rate and a count that includes it, even though
  the stored count has not caught up yet.
* **Viewing as another channel** — a channel that did not rate the comment sees the stored count, without that
  adjustment.
* **Request fails** (step 4) — the button and the count return to what they were, and a toast explains what went wrong
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

* Every comment and every reply has a like button and a dislike button, each showing its count.
* Both counts are visible.
* The buttons show whether the current channel has already liked or disliked that comment.
* Clicking an inactive button records the rate; clicking an active one removes it.
* A comment can be either liked or disliked by a channel, never both at once.
* The button state and the count update immediately, before the server confirms.
* After the comments are reloaded the user still sees their own rate, and a count that includes it, even while the
  stored count is behind.
* A channel that has not rated the comment sees the stored count, with no adjustment applied.
* A failed request reverts the button and the count.
* Sorting by Most likes and Most dislikes uses these counts
  ([US-Comments-01](./US-Comments-01-See-comments.md)).

**Tech notes**

* A rate belongs to a channel and a comment; the rater is the acting channel
  ([US-Channels-02](../channels/US-Channels-02-freely-switch-between-channels.md)), so one account can rate the same
  comment differently from each of its channels.
* Counts are not written on every click. Creating, removing or switching a rate emits an event, and the
  `comment-rate-count-worker` consumes the topic in Kafka batches: it deduplicates the event ids, sums the deltas of the
  whole batch in memory per comment, applies them to the comments table in one statement, and resolves the Kafka
  offsets only after that write succeeds.
* Counts are therefore eventually consistent — behind by a batch rather than by a fixed interval — which is exactly why
  the UI updates optimistically instead of waiting.
* The current channel's own rate state is read from the rate data directly, not from the stored counters, so a user
  always sees their own click reflected correctly while the totals are still catching up.
* Keeping a fresh rate visible works exactly as it does for videos
  ([US-Videos-04](../videos/US-Videos-04-Like-dislike-videos.md)): when the user rates, the client stores the base count
  it was showing together with the delta it applied, keyed by channel and comment, and keeps showing base plus delta
  only while the stored count still equals that base. Once the stored count moves, the local record is dropped and the
  server value is shown as is.
* Unlike a video page, which has one of these, a comment list can produce a record per comment the user rates. Prune
  them as they converge and cap how many are kept, so localStorage does not grow without limit.
* Sorting by Most likes or Most dislikes reads the stored counters, so the order can lag slightly behind reality — the
  same trade-off accepted for the subscriber count in channel search
  ([US-Search-02](../search/US-Search-02-Search-channels.md)). The client-side adjustment is display-only and never
  reaches sorting, so a comment the user has just liked keeps its place until the worker catches up.
* Deleting a comment removes its rates ([US-Comments-05](./US-Comments-05-Manage-own-comments.md)); the worker has to
  handle counters for comments that no longer exist without failing.

**Links**

* [US-Channels-02 — Switch between channels](../channels/US-Channels-02-freely-switch-between-channels.md)
* [US-Comments-01 — See comments](./US-Comments-01-See-comments.md)
* [US-Comments-05 — Manage own comments and replies](./US-Comments-05-Manage-own-comments.md)
* [US-Search-02 — Search channels](../search/US-Search-02-Search-channels.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
