## US-Comments-02 — Load replies

**Description**

As a registered user with a verified account, I want to open the replies under a comment when I'm interested in them, so
that I can follow a conversation without every reply cluttering the comment list.

**User flows**

Open a thread — main flow:

1. User sees a comment with a button showing its number of replies.
2. User clicks it.
3. The first page of replies loads and appears indented under the comment.
4. Each reply shows the author's avatar and channel name, the relative time, the text, the like and dislike counts and a
   "Reply" action ([US-Comments-04](./US-Comments-04-Reply-to-comments.md)).
5. If more replies remain, a "Show more replies" button is shown under the ones already loaded.
6. User clicks it and the next page is appended under them.
7. Steps 5-6 repeat until the whole thread is loaded, at which point the button is gone.

Collapse a thread:

1. User clicks the expander again.
2. The replies are hidden and the button returns to its collapsed state.

Open a thread — branches:

* **Request fails** — the thread shows an error in place of the replies with a retry action; the comment itself and the
  rest of the list keep working ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).
* **Replies changed meanwhile** — the thread loads the current state; a reply deleted in the meantime is simply absent,
  which is not an error.

**Acceptance criteria**

* A comment with at least one reply shows a button with the number of replies.
* Replies are loaded only when that button is clicked — never together with the comment list.
* Replies load in pages of up to 30.
* When more replies remain, a "Show more replies" button is shown under the loaded ones, and it disappears once the
  thread is fully loaded.
* Each page is appended to the replies already shown, not substituted for them.
* Replies are ordered oldest first, so the conversation reads from top to bottom.
* Replies are shown indented under their parent comment, and there is no further nesting — a thread is one flat list.
* Replies of channels that are no longer available (soft deleted) are not shown.
* Collapsing a thread hides the replies; expanding it again shows the ones already loaded, without fetching them a
  second time, for as long as the page stays open.
* A failure inside one thread does not break the comment list around it.

**Tech notes**

* Replies come from their own paginated endpoint, keyed by the top-level comment, so the comment list never carries
  them.
* Because there is only one level of nesting, a thread is a flat list: no recursive query, and the number of replies is
  a single value per comment rather than a subtree size.
* The reply count shown on the comment is denormalized: it goes up when replies are posted
  ([US-Comments-04](./US-Comments-04-Reply-to-comments.md)) and down when they are deleted
  ([US-Comments-05](./US-Comments-05-Manage-own-comments.md)).
* **A `comment-reply-count-worker` does not exist yet and has to be implemented.** It follows the same pattern as the
  counters already in place: consume the reply created and deleted events in Kafka batches, deduplicate the event ids,
  sum the per-comment deltas of a batch in memory, apply them to the comments table in one statement, and resolve the
  Kafka offsets only after that write succeeds.
* The count is therefore eventually consistent, so the number on the button can briefly disagree with the thread it
  opens. The thread itself is always the truth; the button is a hint.
* Paging is keyset-based on the reply ordering, so replies posted while a thread is open do not shift the pages already
  loaded.
* Collapsing a thread only hides it. The replies already loaded are kept in the page's own state — React state or the
  query cache — so re-expanding is instant and costs no request, and "Show more replies" carries on from where it left
  off instead of restarting the thread. This is in-memory only: a page reload starts the thread collapsed and empty
  again.

**Links**

* [US-Comments-01 — See comments](./US-Comments-01-See-comments.md)
* [US-Comments-04 — Reply to comments and replies](./US-Comments-04-Reply-to-comments.md)
* [US-Comments-05 — Manage own comments and replies](./US-Comments-05-Manage-own-comments.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
