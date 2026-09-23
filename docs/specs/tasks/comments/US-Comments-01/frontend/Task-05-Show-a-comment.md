## Show a comment

Needs: [Task-04 — Build the comments section](Task-04-Build-the-comments-section.md)

Build the component the list and the threads both render: the author's avatar and channel name, how long ago it was
posted, the text, the like and dislike counts, a "Reply" action, and — under a comment that has replies — the button
showing how many.

Branch — the text is longer than 400 characters:

1. It is cut off, with a control that expands it in place.

Branch — the comment has been edited:

1. It is marked as edited ([US-Comments-05](../../../../user-stories/comments/US-Comments-05-Manage-own-comments.md)).

The rate buttons come with [US-Comments-06](../../../../user-stories/comments/US-Comments-06-Like-dislike-comments.md),
replying with [US-Comments-04](../../../../user-stories/comments/US-Comments-04-Reply-to-comments.md), and the 3-dot
menu on the user's own comments with US-Comments-05.

Why: one component for comments and replies, so a change to either shows up in both — the only difference is the
indentation and that a reply has no replies of its own.
