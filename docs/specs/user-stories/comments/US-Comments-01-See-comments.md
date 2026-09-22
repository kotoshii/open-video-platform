## US-Comments-01 — See comments

**Description**

As a registered user, I want to read the comments under a video together with their likes and
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

Open one comment from a link:

1. User follows a link to the video page that points at one comment — from an in-app notification
   ([US-Notifications-02](../notifications/US-Notifications-02-In-app-channel.md)), a notification email
   ([US-Notifications-03](../notifications/US-Notifications-03-Email-channel.md)) or My comments
   ([US-My-activity-03](../my-activity/US-My-activity-03-My-comments.md)).
2. Above the normal list, the comments section shows that comment's thread: the top-level comment and its replies, with
   the linked comment highlighted.
3. The rest of the comments load below as usual.

Read the comments — branches:

* **Linked comment no longer exists** — the section says so in place of the thread, and the normal list loads as usual.

* **User's own comments** — the user's own top-level comments are shown at the top of the list, whatever the sorting is.
* **Long comment** — text longer than 400 characters is truncated, with a control to expand it in place.
* **No comments yet** — the section shows an empty state inviting the user to be the first to comment.
* **Request fails** — the whole comments section is replaced by an error state with a retry action, not a toast. The
  rest of the video page keeps working ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

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
* Opening the video page with `?comment=<id>` shows that comment's thread above the list — the top-level comment and its
  replies — with the linked comment highlighted, whether it is a top-level comment or a reply.
* A linked comment that no longer exists is reported with a short note, not an error.
* The list loads more comments as the user scrolls — infinite scroll, not page controls.
* Loading more never repeats a comment already shown and never skips one.
* Comments of channels that no longer exist are not shown. A channel scheduled for deletion is still a live channel,
  so its comments stay visible until the purge runs
  ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md),
  [US-Account-01](../account/US-Account-01-Delete-own-account.md)).
* The total in the header therefore always agrees with the list: comments are removed and the counter decremented by
  the same purge, so there is no state in which the header counts comments the list hides.
* An empty section shows an empty state, not an error.
* A failure loading the comments replaces the section content with a full error state and a retry action — a toast is
  not enough here, since there would be nothing to look at behind it.
* A failure loading the comments does not break the video page: the player, the description and everything else keep
  working.
* On mobile the comments section is not shown inline on the video page: the "Comments" button under the video opens it
  in a bottom drawer ([US-Videos-01](../videos/US-Videos-01-Watch-videos.md)). The drawer scrolls on its own, and it is
  the drawer's scrolling — not the page's — that loads more comments.

**Tech notes**

* The list is paginated on the API side in pages of up to 30 and consumed as infinite scroll on the client.
* Ordering plus infinite scroll needs a result set that stays stable while new comments arrive: keyset-paginate from the
  ordering key of the first page rather than offsetting into a list that shifts underneath.
* `?comment=<id>` loads the linked thread through a request of its own instead of scrolling the paginated list until it
  appears, which on a busy video could mean loading hundreds of comments first. When the id belongs to a reply, the
  server resolves its top-level comment. The linked thread is left out of the paginated list below, the same way pinned
  own comments are, or it would appear twice.
* Pinning the user's own comments on top is a separate query merged into the first page. They must be excluded from the
  paginated list, otherwise they appear a second time when scrolling reaches them.
* The author's channel name and avatar are denormalized into the comment rows and refreshed by the channel-updated event
  ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)), so the list renders without calling the
  Channels service per row.
* A channel is never hidden while it exists ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)), so
  the comment list needs no visibility filter on the author beyond the rows being gone after a purge. This is what
  keeps the header total honest: the counter and the rows move together, instead of the counter including comments the
  list filters out.
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

* [Task-01 — comment-api: Implement GET /comments](../../tasks/comments/US-Comments-01/backend/Task-01-comment-api-Implement-GET-comments.md)
* [Task-02 — comment-api: Implement GET /comments/{commentId}/thread](../../tasks/comments/US-Comments-01/backend/Task-02-comment-api-Implement-GET-comments-commentId-thread.md)
* [Task-03 — comment-api: Keep the author's name and avatar fresh](../../tasks/comments/US-Comments-01/backend/Task-03-comment-api-Keep-the-authors-name-and-avatar-fresh.md)

FE:

* [Task-04 — Build the comments section](../../tasks/comments/US-Comments-01/frontend/Task-04-Build-the-comments-section.md)
* [Task-05 — Show a comment](../../tasks/comments/US-Comments-01/frontend/Task-05-Show-a-comment.md)
* [Task-06 — Open a linked comment thread](../../tasks/comments/US-Comments-01/frontend/Task-06-Open-a-linked-comment-thread.md)
