## US-My-activity-03 — My comments

**Description**

As a registered user, I want to see every comment and reply I have posted in one place, so that
I can find what I wrote and remove what I no longer want to keep.

The list is the current channel's comments and replies. Some elements are not in the mockups; this story is the source
of truth.

**User flows**

See my comments — main flow:

1. User clicks "My comments" in the sidebar ([US-UI-UX-03](../ui-ux/US-UI-UX-03-Global-layout.md)).
2. User sees the comments and replies the current channel has posted, most recent first.
3. Each item shows the video's thumbnail and title, the video's channel name, the name of the channel that wrote the
   comment, when it was posted, and the comment text.
4. The list is paginated, with page controls at the bottom.

Read a long comment:

1. A comment longer than 400 characters is cut off, with a "Show more" button.
2. User clicks it, and a modal opens with the full comment, scrollable.

Open the video:

1. User clicks the video's thumbnail or title.
2. The video page opens with that comment's thread.

Search:

1. User types into the search bar at the top and submits.
2. The list shows only the comments whose text, or whose video's title, contains the query.

Delete a comment:

1. User hovers over an item and a delete button appears; on mobile it is always visible.
2. User clicks it, and a confirmation modal appears. For a top-level comment that has replies, it says that the replies
   are deleted too ([US-Comments-05](../comments/US-Comments-05-Manage-own-comments.md)).
3. User confirms; the comment is deleted and the list is loaded again.

Branches:

* **The video is no longer available** — the comment is not shown.
* **No comments yet, or nothing matches the search** — the list shows an empty state.
* **Cancelling the confirmation** — the modal closes and nothing changes.
* **The list fails to load** — a full-page error state with a retry action
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
* **Deleting fails** — the default toast behaviour applies and the comment stays.

**Acceptance criteria**

* The sidebar has a "My comments" item that opens the page.
* The page lists the top-level comments and the replies posted by the current channel, most recent first, with page
  controls at the bottom — no infinite scroll.
* Each item shows the video thumbnail, the video title, the video's channel name, the commenting channel's name, the
  date posted and the comment text.
* The video title takes at most two lines and the video's channel name one line; both are cut off beyond that.
* Comment text longer than 400 characters is cut off with "Show more", which opens the full comment in a scrollable
  modal.
* Clicking the video's thumbnail or title opens the video page with that comment's thread.
* The search bar finds comments whose text or video title contains the query, and is submitted rather than filtering as
  the user types.
* Hovering over an item shows a delete button, always visible on mobile. Deleting asks for confirmation and loads the
  list again afterwards.
* Comments on videos that are no longer available are not shown.
* Failures to load the list are shown as a full-page error; a failure to delete is shown as a toast.

**Tech notes**

* Deleting is the same operation as in the comments section
  ([US-Comments-05](../comments/US-Comments-05-Manage-own-comments.md)): a hard delete, with a top-level comment taking
  its replies along, and the counters corrected by their workers. This page only lists comments and calls it.
* The 400-character threshold matches the comments section, but "Show more" works differently here: it opens a modal
  instead of expanding in place, which keeps the list compact.
* The comment text is already in the comments database; the video title is not. For the substring search to work on
  both, store the title with the comment and refresh it from the video-updated event — the comments service already
  keeps the channel name and avatar the same way ([US-Comments-01](../comments/US-Comments-01-See-comments.md)). A
  `pg_trgm` index is the step after a plain substring match if it ever becomes slow.
* Opening the video at a specific thread uses the video page's `?comment=<id>` link
  ([US-Comments-01](../comments/US-Comments-01-See-comments.md)).
* Visibility is enforced when the list is served.

**Links**

* [US-Comments-01 — See comments](../comments/US-Comments-01-See-comments.md)
* [US-Comments-05 — Manage own comments and replies](../comments/US-Comments-05-Manage-own-comments.md)
* [US-My-activity-01 — Watch history](./US-My-activity-01-Watch-history.md)
* [US-UI-UX-03 — Global layout](../ui-ux/US-UI-UX-03-Global-layout.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
