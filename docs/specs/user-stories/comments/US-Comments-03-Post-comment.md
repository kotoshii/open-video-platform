## US-Comments-03 — Post a comment

**Description**

As a registered user, I want to post a comment under a video, so that I can say what I think
about it.

**User flows**

Post a comment — main flow:

1. User opens a video page and sees the comment box at the top of the comments section, showing the avatar of the
   channel they are currently acting as and the placeholder "Leave a comment...".
2. User types the comment.
3. User clicks "Comment".
4. The comment is posted as the current channel.
5. The new comment appears at the top of the list and the total in the section header goes up.
6. The box is cleared.

Post a comment — branches:

* **Empty comment** (step 3) — nothing is sent and the comment is not posted.
* **Request fails** (step 4) — a toast explains what went wrong
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)) and the typed text stays in the box, so nothing is lost.
* **Sorting other than Newest first** (step 5) — the comment still appears at the top, because the user's own comments
  are pinned there ([US-Comments-01](./US-Comments-01-See-comments.md)).

**Acceptance criteria**

* The comments section has a comment box at the top, showing the current channel's avatar.
* A comment cannot be empty.
* A comment cannot be longer than 5000 characters, and the form does not let the user go over it.
* A comment cannot be posted on a video that does not exist, that the user is not allowed to watch, or whose author
  has turned comments off ([US-Videos-03](../videos/US-Videos-03-Manage-own-videos.md)). The server refuses it; hiding
  the comment box is not what enforces it.
* The comment is attributed to the channel the user is currently acting as, not to the account.
* After posting, the new comment appears at the top of the list without reloading the page.
* The total number of comments in the section header goes up.
* The box is cleared after a successful post.
* A failed post keeps the typed text and shows a toast.
* On mobile the comment box sends with an arrow button instead of the "Comment" text button.

**Tech notes**

* The author is the current channel ([US-Channels-02](../channels/US-Channels-02-freely-switch-between-channels.md));
  the channel id travels in the header the gateway already validates, so the API never takes an author from the request
  body.
* Posting emits an event. The `video-comment-count-worker` consumes the topic in Kafka batches, sums the per-video
  deltas of a batch and applies them in a single statement, so the number in the header is eventually consistent — the
  same pattern every other counter follows.
* The posted comment is rendered from the API response rather than by refetching the list, so it does not depend on
  where the current sort order would place it.
* A comment is at most 5000 characters. That is unrelated to the 400-character threshold in
  [US-Comments-01](./US-Comments-01-See-comments.md), which is only where long text is truncated for display.
* The limit is enforced on the server as well as in the form — the client-side check is a convenience, not the rule.

**Links**

* [US-Channels-02 — Switch between channels](../channels/US-Channels-02-freely-switch-between-channels.md)
* [US-Comments-01 — See comments](./US-Comments-01-See-comments.md)
* [US-Comments-04 — Reply to comments and replies](./US-Comments-04-Reply-to-comments.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* [Task-01 — Migrate video-comment-count-worker to the new structure](../../tasks/comments/US-Comments-03/backend/Task-01-Migrate-video-comment-count-worker-to-the-new-structure.md)
* [Task-02 — channel-api: Look up channels by id over gRPC](../../tasks/comments/US-Comments-03/backend/Task-02-channel-api-Look-up-channels-by-id-over-gRPC.md)
* [Task-03 — comment-api: Implement POST /comments/{videoId}](../../tasks/comments/US-Comments-03/backend/Task-03-comment-api-Implement-POST-comments-videoId.md)
* [Task-04 — video-comment-count-worker: Apply the comment counts](../../tasks/comments/US-Comments-03/backend/Task-04-video-comment-count-worker-Apply-the-comment-counts.md)

FE:

* [Task-05 — Add the comment box](../../tasks/comments/US-Comments-03/frontend/Task-05-Add-the-comment-box.md)
