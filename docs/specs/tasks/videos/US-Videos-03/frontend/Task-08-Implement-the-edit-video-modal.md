## Implement the edit video modal

Needs: [Task-07 — Build the video management menu](Task-07-Build-the-video-management-menu.md),
[US-Videos-05 Task-24 — Implement the video details form](../../US-Videos-05/frontend/Task-24-Implement-the-video-details-form.md)

Open the details form from the menu's "Edit", in a modal, with the video's current values and its thumbnail area. It
states that changes take a while to show up in search and the feed.

Main flow:

1. User edits and saves; the modal closes and the video in the list shows the new values at once.

Branch — the user cancels or closes:

1. Nothing is saved.

Branch — saving fails:

1. The toast behaviour applies and the modal stays open with the entered values.

Why: the list is updated on the client rather than reloaded, so the author's position in a long list is not lost by an
edit.
