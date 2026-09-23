## Implement the account deletion pages

Needs: [Task-02 — account-api: Implement POST /accounts/deletion/confirm](../backend/Task-02-account-api-Implement-POST-accounts-deletion-confirm.md),
[Task-03 — account-api: Implement POST /accounts/deletion/cancel](../backend/Task-03-account-api-Implement-POST-accounts-deletion-cancel.md),
[US-Channels-06 Task-18 — Implement the channel deletion pages](../../../channels/US-Channels-06/frontend/Task-18-Implement-the-channel-deletion-pages.md)

Build the two public pages the emails link to, outside the layout, in the shape of the channel deletion pages.

Main flow — the confirmation link:

1. The page takes the token from the URL and calls the confirm endpoint.
2. It states the date and time the deletion will run, and that the account stays usable until then.

Main flow — the cancel link:

1. The page clears the schedule and confirms that nothing will be deleted.

Branch — the link is expired, invalid or already used:

1. The page explains what happened, with no way to resend — deleting an account is deliberately not made easy.
