## US-Comments-06 — Like/dislike comments and replies

**Description**

As a registered user, I want to like or dislike comments and replies, so that I can show what I
agree with and help the good ones surface.

**User flows**

Rate a comment — main flow:

1. User sees the like and dislike buttons, each with its count, under every comment and reply.
2. User clicks "like".
3. The button becomes active straight away. The counts stay as they are.
4. The rate is recorded for the channel the user is currently acting as.

Rate a comment — branches:

* **Removing a rate** (step 2) — clicking an active like or dislike again removes it, and the button goes inactive.
* **Switching a rate** (step 2) — clicking "dislike" on a comment that is already liked moves the rate, and the active
  state moves to the dislike button.
* **Reloading the page** (after step 4) — the user's own rate is still shown as active; the counts are the stored ones,
  which include the new rate once it has been applied.
* **No rates yet** (step 1) — no number is shown next to either button.
* **Request fails** (step 4) — the button returns to its previous state, and a toast explains what went wrong
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

* Every comment and every reply has a like button and a dislike button, each showing its count.
* A count of zero is not shown: a comment with no likes shows the like button without a number, and the same for
  dislikes.
* The buttons show whether the current channel has already liked or disliked that comment.
* Clicking an inactive button records the rate; clicking an active one removes it.
* A comment can be either liked or disliked by a channel, never both at once.
* The button state changes immediately, before the server confirms, and is still shown after the comments are
  reloaded.
* The counts are always the stored ones and are not adjusted on the client — the button state is what confirms the
  action.
* A failed request reverts the button.
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
* Counts are therefore eventually consistent — behind by a batch rather than by a fixed interval.
* The current channel's own rate state is read from the rate data directly, not from the stored counters, which is what
  keeps the active button correct while the totals are still catching up.
* **The counts are not adjusted on the client**, for the same reason as video rates
  ([US-Videos-04](../videos/US-Videos-04-Like-dislike-videos.md)): the active button already confirms the click, and
  keeping the number in step as well is extra work for very little benefit. Hiding a zero count removes the one case
  that would look broken.
* Sorting by Most likes or Most dislikes reads the stored counters, so the order can lag slightly behind reality — the
  same trade-off accepted for the subscriber count in channel search
  ([US-Search-02](../search/US-Search-02-Search-channels.md)). A comment the user has just liked keeps its place until
  the worker catches up.
* Deleting a comment removes its rates ([US-Comments-05](./US-Comments-05-Manage-own-comments.md)); the worker has to
  handle counters for comments that no longer exist without failing.

**Links**

* [US-Channels-02 — Switch between channels](../channels/US-Channels-02-freely-switch-between-channels.md)
* [US-Comments-01 — See comments](./US-Comments-01-See-comments.md)
* [US-Comments-05 — Manage own comments and replies](./US-Comments-05-Manage-own-comments.md)
* [US-Search-02 — Search channels](../search/US-Search-02-Search-channels.md)
* [US-Videos-04 — Like/dislike videos](../videos/US-Videos-04-Like-dislike-videos.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* [Task-01 — Migrate comment-rate-api to the new structure](../../tasks/comments/US-Comments-06/backend/Task-01-Migrate-comment-rate-api-to-the-new-structure.md)
* [Task-02 — Migrate comment-rate-count-worker to the new structure](../../tasks/comments/US-Comments-06/backend/Task-02-Migrate-comment-rate-count-worker-to-the-new-structure.md)
* [Task-03 — comment-api: Expose a comment's existence over gRPC](../../tasks/comments/US-Comments-06/backend/Task-03-comment-api-Expose-a-comments-existence-over-gRPC.md)
* [Task-04 — comment-rate-api: Implement POST /comment-rates/{commentId}](../../tasks/comments/US-Comments-06/backend/Task-04-comment-rate-api-Implement-POST-comment-rates-commentId.md)
* [Task-05 — comment-rate-api: Implement DELETE /comment-rates/{commentId}](../../tasks/comments/US-Comments-06/backend/Task-05-comment-rate-api-Implement-DELETE-comment-rates-commentId.md)
* [Task-06 — comment-rate-api: Return the channel's rates for comments](../../tasks/comments/US-Comments-06/backend/Task-06-comment-rate-api-Return-the-channels-rates-for-comments.md)
* [Task-07 — comment-rate-api: Delete rates when a comment goes](../../tasks/comments/US-Comments-06/backend/Task-07-comment-rate-api-Delete-rates-when-a-comment-goes.md)
* [Task-08 — comment-rate-count-worker: Apply the comment rate counts](../../tasks/comments/US-Comments-06/backend/Task-08-comment-rate-count-worker-Apply-the-comment-rate-counts.md)

FE:

* [Task-09 — Add the rate buttons to comments](../../tasks/comments/US-Comments-06/frontend/Task-09-Add-the-rate-buttons-to-comments.md)
