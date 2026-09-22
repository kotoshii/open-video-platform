## End sessions from the Sessions tab

Needs: [Task-05 — Build the Sessions tab](Task-05-Build-the-Sessions-tab.md),
[Task-04 — auth-api: Implement DELETE /auth/sessions/others](../backend/Task-04-auth-api-Implement-DELETE-auth-sessions-others.md)

Main flow:

1. Hovering a session shows its "end session" button; on mobile it is always visible.
2. Clicking it opens a confirmation showing that session's details.
3. On confirm the app ends it and loads the list again.

Main flow — every other session:

1. User clicks "End all other sessions", which says that it affects every session but this one.
2. A confirmation appears, and on confirm only the current session is left in the list.

Branch — the session was already ended somewhere else:

1. The list is loaded again and shows the real state, rather than an error.

Branch — there are no other sessions:

1. "End all other sessions" is unavailable.

Why: the confirmation repeats that session's details because two devices in a list can look almost identical, and this
action cannot be undone.
