## US-Channels-06 — Delete own channel

**Description**

As an authenticated user with a verified account and more than one channel, I want to delete a channel I no longer need,
so that it and everything it published disappear from the platform — with a window to change my mind before that becomes
permanent.

**User flows**

Delete a channel — main flow:

1. User opens the settings page on the Channel tab ([US-Channels-03](./US-Channels-03-current-channel-settings.md)).
2. User sees the "Delete channel" button, styled as destructive (red).
3. On click, a confirmation modal appears with text spelling out the consequences. Buttons: "Cancel" (primary, left) and
   "Yes" (secondary, right).
4. The "Yes" button stays disabled for 10 seconds to prevent accidental clicks, with the countdown shown in the button
   itself.
5. After pressing "Yes", the user receives an email with a confirmation link.
6. The email warns about the consequences once again.
7. Opening the link takes the user to a dedicated page in the app.
8. The link is validated (it lives for 5 minutes).
9. If valid, the channel is deleted and the user is taken to the channel selection page (the same one as after logging
   in).
10. If only one channel is left, the selection page is skipped and the user lands on the homepage with a success
    notification shown once.
11. After the deletion, the user receives a second email saying the channel and its data are no longer accessible, and
    that they can restore the channel within a week using the link in that email. After the week, the deletion is
    permanent.

Delete a channel — branches:

* **User cancels the confirmation** (step 3) — the modal closes and nothing happens.
* **Expired or invalid link** (step 8) — the page explains what happened. There is deliberately no "resend" button, so
  channel deletion is not encouraged.
* **Restore within the week** (step 11) — the user opens the restore link from the second email and the channel and its
  content become visible again.
* **Restore window passes** (step 11) — the channel and all its related data are deleted permanently, with no way to
  restore.

**Acceptance criteria**

* Only an account with more than one channel can delete a channel; the last remaining one goes away with the account
  itself (Account settings epic in [project-overview.md](../../project-overview.md)).
* The "Delete channel" button is in the Channel tab of the settings page and is styled as destructive.
* Deleting requires a confirmation modal that states the consequences, with the confirm button disabled for 10 seconds
  and a visible countdown.
* Confirming in the modal deletes nothing yet — it only sends the confirmation email.
* The confirmation link is valid for 5 minutes and works once.
* An expired or invalid link shows a clear message and offers no way to resend it.
* After a successful deletion the user continues to the channel selection page, or straight to the homepage with a
  one-time success notification when only one channel is left.
* Deleting a channel never logs the user out of the account.
* A second email confirms the deletion and carries a restore link valid for one week.
* Restoring within the week brings the channel and its content back as they were.
* Once the week has passed, the channel and all its data are gone for good.

**Tech notes**

* The channel is soft deleted first: all its content stays in the databases — videos, comments, subscriptions — but
  nothing of it is visible. Comments are hidden, videos stop being indexed for search, the channel is not shown in other
  users' subscriptions, and so on.
* Full deletion means removing ALL related data: videos (database records and the physical files), subscriptions,
  comments — everything, as if the channel never existed (logs aside, obviously).
* Both the soft delete and the final purge fan out over Kafka; every service deletes the data it owns and reports back,
  so this is a saga across services, not a single transaction. Each step has to be idempotent, since a purge may be
  retried.
* The purge is triggered a week after the soft delete by a scheduled job, not by the deletion request itself.
* Both emails go through the custom email module, the same one used for account confirmation
  ([US-Auth-2](../auth/US-Auth-2-Account-confirmation.md)).
* The confirmation token is single-use with a 5-minute lifetime, the restore token lives for a week; both are kept
  server-side (Redis fits the short-lived one).
* Deleting the channel the user is currently acting as also has to reset the stored current channel
  ([US-Channels-02](./US-Channels-02-freely-switch-between-channels.md)) and re-issue tokens, since the `channelIds`
  claim changes.

**Links**

* [US-Auth-2 — Account confirmation](../auth/US-Auth-2-Account-confirmation.md)
* [US-Channels-02 — Switch between channels](./US-Channels-02-freely-switch-between-channels.md)
* [US-Channels-03 — Current channel settings](./US-Channels-03-current-channel-settings.md)

**Tasks**

BE:

* TODO

FE:

* TODO
