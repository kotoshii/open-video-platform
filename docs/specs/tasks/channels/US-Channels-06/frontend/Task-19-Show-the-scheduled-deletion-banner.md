## Show the scheduled deletion banner

Needs: [Task-17 — Add Delete channel to the Channel tab](Task-17-Add-Delete-channel-to-the-Channel-tab.md),
[US-Auth-02 Task-08 — Show the unconfirmed email banner](../../../auth/US-Auth-02/frontend/Task-08-Show-the-unconfirmed-email-banner.md)

Show a banner at the top of every page inside the layout while the channel being acted as has a deletion scheduled: what
will be deleted and when, with a link to the settings page where it can be cancelled. It closes for 24 hours at a time,
reusing the dismissal built for the unconfirmed email banner.

Branch — the account has a deletion scheduled as well:

1. The account's banner is shown instead, since it supersedes this one
   ([US-Account-01](../../../../user-stories/account/US-Account-01-Delete-own-account.md)).

Why: a week is long enough to forget a decision, so the banner comes back every day rather than staying dismissed.
