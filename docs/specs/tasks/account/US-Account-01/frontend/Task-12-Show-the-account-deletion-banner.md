## Show the account deletion banner

Needs: [Task-02 — account-api: Implement POST /accounts/deletion/confirm](../backend/Task-02-account-api-Implement-POST-accounts-deletion-confirm.md),
[US-Channels-06 Task-19 — Show the scheduled deletion banner](../../../channels/US-Channels-06/frontend/Task-19-Show-the-scheduled-deletion-banner.md)

Show a banner at the top of every page inside the layout while the account has a deletion scheduled, whichever channel
the user is acting as: that the account and all its channels will be deleted, when, and a link to the Account tab where
it can be cancelled. It closes for 24 hours at a time, with the same dismissal as the other banners, and takes the
place of a channel's deletion banner.

Why: the date comes from `GET /accounts/current`. Load it once with the layout and share the cached answer with the
Account tab, so the banner and the tab can never disagree about the date.
