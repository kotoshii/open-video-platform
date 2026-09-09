## US-Comments-01 — See comments

**Description**

As a registered user with a verified account, I want to read the comments under a video together with their likes and
dislikes, and choose how they are ordered, so that I can see what other people think about it.

**User flows**

Read the comments — main flow:

1. User opens a video page and reaches the comments section.
2. The section header shows the total number of comments and the sort control, set to "Newest first".
3. Below the header, user sees the list of top-level comments. Each one shows the author's avatar and channel name, how
   long ago it was posted, the text, the like and dislike counts, and a "Reply" action.
4. A comment that has replies shows a button with the number of replies under it
   ([US-Comments-02](./US-Comments-02-Load-replies.md)).
5. User scrolls and more comments load.

Change the sorting:

1. User opens the sort control.
2. User picks one of: Newest first, Oldest first, Most likes, Most dislikes.
3. The list reloads from the top in the chosen order.

Read the comments — branches:

* **User's own comments** — the user's own top-level comments are shown at the top of the list, whatever the sorting is.
* **Long comment** — text longer than 400 characters is truncated, with a control to expand it in place.
* **No comments yet** — the section shows an empty state inviting the user to be the first to comment.
* **Request fails** — the comments section shows its own error state with a retry action, and the rest of the video page
  keeps working ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Acceptance criteria**

* The video page has a comments section with a header and a list of top-level comments.
* The header shows the total number of comments, counting replies as well as top-level comments.
* The sort control offers Newest first, Oldest first, Most likes and Most dislikes, and defaults to Newest first.
* Changing the sorting reloads the list from the beginning in the new order.
* Each comment shows the author's avatar and channel name, the relative time since posting, the text, the like count,
  the dislike count and a "Reply" action.
* A comment with replies shows a button with the number of replies; a comment without replies shows none.
* The user's own top-level comments appear at the top of the list under every sort order. Their replies are not pinned.
* Comment text longer than 400 characters is truncated and can be expanded in place.
* The list loads more comments as the user scrolls — infinite scroll, not page controls.
* Loading more never repeats a comment already shown and never skips one.
* Comments of channels that are no longer available (soft deleted — see
  [US-Channels-06](../channels/US-Channels-06-delete-own-channel.md) and
  [US-Account-01](../account/US-Account-01-Delete-own-account.md)) are not shown.
* An empty section shows an empty state, not an error.
* A failure loading the comments does not break the video page.

**Tech notes**

* The list is paginated on the API side in pages of up to 30 and consumed as infinite scroll on the client.
* Ordering plus infinite scroll needs a result set that stays stable while new comments arrive: keyset-paginate from the
  ordering key of the first page rather than offsetting into a list that shifts underneath.
* Pinning the user's own comments on top is a separate query merged into the first page. They must be excluded from the
  paginated list, otherwise they appear a second time when scrolling reaches them.
* The author's channel name and avatar are denormalized into the comment rows and refreshed by the channel-updated event
  ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)), so the list renders without calling the
  Channels service per row.
* Comments of soft-deleted channels are filtered at serve time against current visibility, the same rule the feed and
  search follow.
* Like and dislike counts come from the `comment-rate-count-worker` and are eventually consistent
  ([US-Comments-06](./US-Comments-06-Like-dislike-comments.md)), which is also why sorting by Most likes or Most
  dislikes can be slightly behind.
* The total in the header is maintained by the `video-comment-count-worker` and includes replies
  ([US-Comments-03](./US-Comments-03-Post-comment.md)).
* Timestamps are stored absolute and rendered as relative ("5 minutes ago") on the client, so they stay correct without
  re-fetching.

**Links**

* [US-Channels-03 — Current channel settings](../channels/US-Channels-03-current-channel-settings.md)
* [US-Comments-02 — Load replies](./US-Comments-02-Load-replies.md)
* [US-Comments-03 — Post a comment](./US-Comments-03-Post-comment.md)
* [US-Comments-06 — Like/dislike comments and replies](./US-Comments-06-Like-dislike-comments.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
