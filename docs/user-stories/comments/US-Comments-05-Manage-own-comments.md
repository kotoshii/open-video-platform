## US-Comments-05 — Manage own comments and replies

**Description**

As a registered user with a verified account, I want to edit and delete the comments and replies I posted, so that I can
fix what I wrote or take it back.

**User flows**

Edit — main flow:

1. User hovers over their own comment or reply and a 3-dot button appears; on mobile it is always visible.
2. User opens the menu and picks "Edit".
3. The text turns into an editable box with a "Save" and a "Cancel" button.
4. User changes the text and clicks "Save".
5. The comment shows the new text, marked as edited.

Delete — main flow:

1. User opens the 3-dot menu on their own comment or reply and picks "Delete".
2. A confirmation modal appears. For a top-level comment that has replies, it states that the replies go with it.
3. User confirms.
4. The comment or reply disappears from the list, and the counts around it go down.

Branches:

* **Cancel an edit** (step 4) — the box closes and the text stays as it was.
* **Empty text on save** (step 4) — nothing is saved; an empty comment cannot be left behind.
* **Cancel a deletion** (step 3) — the modal closes and nothing happens.
* **Request fails** — a toast explains what went wrong
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)) and the comment is left exactly as it was.

**Acceptance criteria**

* The 3-dot menu is shown only on the user's own comments and replies — on hover on desktop, always visible on mobile.
* The menu offers "Edit" and "Delete".
* Editing replaces the text in place: the comment keeps its position in the list and its likes and dislikes.
* An edited comment or reply is marked as edited.
* An edit cannot leave the text empty, and cannot take the text over the 5000-character limit
  ([US-Comments-03](./US-Comments-03-Post-comment.md)).
* Deleting requires a confirmation.
* Deleting a top-level comment deletes its replies as well, and the confirmation says so.
* Deleting a reply removes only that reply.
* After a deletion, the video's total comment count goes down by the number of items removed, and the comment's reply
  count is corrected ([US-Comments-01](./US-Comments-01-See-comments.md),
  [US-Comments-02](./US-Comments-02-Load-replies.md)).
* The likes and dislikes of a deleted comment are removed with it.
* Failures are shown as a toast and change nothing.

**Tech notes**

* Ownership is checked on the server against the acting channel
  ([US-Channels-02](../channels/US-Channels-02-freely-switch-between-channels.md)); hiding the menu in the UI is not
  what enforces it.
* Editing keeps the same row, so the id, the rates and the position in the thread are untouched — only the text and an
  "edited" flag change.
* Deleting a top-level comment removes its replies in the same operation. With a single level this is a parent plus its
  direct children, not a recursive walk down a tree.
* Deletion emits events so the `video-comment-count-worker` decrements the video's comment count by the number of
  items removed, the `comment-reply-count-worker` decrements the parent's reply count when a reply goes
  ([US-Comments-02](./US-Comments-02-Load-replies.md)), and the rates belonging to those comments are removed
  ([US-Comments-06](./US-Comments-06-Like-dislike-comments.md)).
* Deleting a top-level comment takes its replies with it, so the parent's reply-count row disappears rather than being
  decremented — only the video's comment count has to move, by one plus the number of replies.
* Comments are hard deleted — the rows are removed, not flagged. Channels and accounts are soft deleted because they
  can be restored; a comment has no restore flow, so there is nothing a tombstone would serve. A deleted comment simply
  disappears, with no "[deleted]" placeholder left behind in the list.

**Links**

* [US-Channels-02 — Switch between channels](../channels/US-Channels-02-freely-switch-between-channels.md)
* [US-Comments-01 — See comments](./US-Comments-01-See-comments.md)
* [US-Comments-02 — Load replies](./US-Comments-02-Load-replies.md)
* [US-Comments-06 — Like/dislike comments and replies](./US-Comments-06-Like-dislike-comments.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
