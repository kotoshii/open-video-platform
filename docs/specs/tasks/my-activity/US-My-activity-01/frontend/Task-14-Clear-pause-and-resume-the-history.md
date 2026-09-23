## Clear, pause and resume the history

Needs: [Task-07 — watch-history-api: Implement DELETE /watch-history](../backend/Task-07-watch-history-api-Implement-DELETE-watch-history.md),
[Task-08 — watch-history-api: Implement PUT /watch-history/paused](../backend/Task-08-watch-history-api-Implement-PUT-watch-history-paused.md),
[Task-12 — Build the watch history page](Task-12-Build-the-watch-history-page.md)

Add "Clear watch history" and "Pause watch history": in a panel on the right on desktop, and on mobile in a popover
opened by a button next to the search input.

Main flow — clear:

1. A confirmation modal says the whole history will be removed.
2. On confirm, the history is cleared and the list shows its empty state.

Main flow — pause:

1. A confirmation modal explains that, while paused, watched videos are not recorded and do not influence
   recommendations.
2. On confirm, the page shows that the history is paused, and the button becomes "Resume watch history".

Main flow — resume:

1. No confirmation; recording starts again with the next video watched.

Branch — the user cancels a confirmation:

1. The modal closes and nothing changes.

Branch — the request fails:

1. A toast, and nothing changes.

Why: the paused state comes with the list response, so the notice and the right button are there on the first paint
rather than after a second request.
