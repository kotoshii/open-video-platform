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

Why: both pages are public, because the links are opened from an inbox as often as from inside the app, and the token
in the URL is what authorises the action.
