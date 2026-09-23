## Implement the channel deletion pages

Needs: [Task-02 — channel-api: Implement POST /channels/deletion/confirm](../backend/Task-02-channel-api-Implement-POST-channels-deletion-confirm.md),
[Task-03 — channel-api: Implement POST /channels/deletion/cancel](../backend/Task-03-channel-api-Implement-POST-channels-deletion-cancel.md)

Build the two pages the emails link to, both outside the layout.

Main flow — the confirmation link:

1. The page takes the token from the URL and calls the confirm endpoint.
2. It states the date and time the deletion will run, and that the channel stays usable until then.

Main flow — the cancel link:

1. The page clears the schedule and confirms that nothing will be deleted.

Branch — the link is expired, invalid or already used:

1. The page explains what happened, with no way to resend — deleting a channel is deliberately not made easy.

Branch — the link is for a channel of another account:

1. The page says the link belongs to another account.

Why: the pages sit outside the layout but need a session — a visitor without one logs in first and comes back
([US-Auth-04](../../../../user-stories/auth/US-Auth-04-Session-persistence.md)) — and the token in the URL says which
channel the action is for, whichever channel the user is acting as.
