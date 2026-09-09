## US-Comments-04 — Reply to comments and replies

**Description**

As a registered user with a verified account, I want to reply to a comment or to someone's reply, so that I can answer a
specific person in the conversation.

**User flows**

Reply to a comment — main flow:

1. User clicks "Reply" under a top-level comment.
2. A reply box opens under that comment, with the placeholder "Leave a reply...", a "Reply" button and a "Cancel"
   button.
3. User types the reply and clicks "Reply".
4. The reply is posted into that comment's thread.
5. The thread expands if it was collapsed, the new reply is visible in it, and the number of replies on the comment goes
   up.
6. The box closes.

Reply to a reply:

1. User clicks "Reply" under a reply.
2. The reply box opens, prefilled with an `@mention` of that reply's author.
3. User types the rest and clicks "Reply".
4. The reply is posted into the **same** thread, under the top-level comment rather than under the reply — there is only
   one level of nesting.
5. The mention is what shows who is being answered.

Reply — branches:

* **Cancel** (step 2) — the box closes and the typed text is discarded.
* **Empty reply** (step 3) — nothing is sent.
* **Request fails** (step 4) — a toast explains what went wrong
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)) and the box stays open with the text in it.
* **Mention removed** — the user may edit or delete the prefilled mention; the reply is still posted into the same
  thread, since the mention is only text.

**Acceptance criteria**

* Every top-level comment and every reply has a "Reply" action.
* Clicking it opens a reply box with a "Reply" and a "Cancel" button.
* Replying to a top-level comment posts the reply into that comment's thread.
* Replying to a reply posts into the same thread, never under the reply — a third level cannot be created.
* Replying to a reply prefills the box with an `@mention` of that reply's author.
* The mention is ordinary text: the user can edit or remove it, and the reply is posted either way.
* A reply cannot be empty, and is subject to the same 5000-character limit as a comment
  ([US-Comments-03](./US-Comments-03-Post-comment.md)) — the mention counts towards it.
* After posting, the thread shows the new reply and the number of replies on the comment goes up.
* The video's total comment count goes up as well, since replies are counted too
  ([US-Comments-01](./US-Comments-01-See-comments.md)).
* Cancelling discards the text and closes the box.
* A failed reply keeps the text and shows a toast.

**Tech notes**

* The parent of a reply is always a top-level comment. When the user replies to a reply, the client sends the top-level
  comment as the parent; the reply's own id is used only to build the mention.
* The single level is enforced in the schema rather than in application code, so a reply can never point at another
  reply — for example by constraining a reply's parent to rows that are themselves top-level.
* Mentions are stored as plain text in this story. There is no autocomplete, no mention index and no notification; if
  mentioning someone should later notify them, that belongs to the Notifications epic
  (see [project-overview.md](../../project-overview.md)).
* A reply is a comment: it is authored by the current channel and emits the same event as a top-level comment, so the
  `video-comment-count-worker` counts it ([US-Comments-03](./US-Comments-03-Post-comment.md)).
* Posting a reply emits an event for the `comment-reply-count-worker` — which still has to be built — to increment the
  parent comment's reply count. How that count is maintained belongs to
  [US-Comments-02](./US-Comments-02-Load-replies.md).

**Links**

* [US-Comments-01 — See comments](./US-Comments-01-See-comments.md)
* [US-Comments-02 — Load replies](./US-Comments-02-Load-replies.md)
* [US-Comments-03 — Post a comment](./US-Comments-03-Post-comment.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
