## US-Account-01 — Delete own account

**Description**

As a registered user with a verified account, I want to schedule my account and all its channels for deletion and keep
a week to change my mind, so that I and everything I published disappear from the platform without a single click
making that irreversible.

Nothing is hidden or locked during that week: the account stays signed in and fully usable, exactly as in
[US-Channels-06](../channels/US-Channels-06-delete-own-channel.md). Deletion happens once, at the end of the window.

**User flows**

Request the deletion — main flow:

1. User opens the settings page on the Account tab
   ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)).
2. User sees the "Delete account" button, styled as destructive (red).
3. On click, a confirmation modal appears with text spelling out the consequences, including that every channel of the
   account goes with it. Buttons: "Cancel" (primary, left) and "Yes" (secondary, right).
4. The "Yes" button stays disabled for 10 seconds to prevent accidental clicks, with the countdown shown in the button
   itself.
5. After pressing "Yes", the user receives an email with a confirmation link.
6. The email warns about the consequences once again.
7. Opening the link takes the user to a dedicated page in the app.
8. The link is validated (it lives for 5 minutes).
9. If valid, the deletion is scheduled for a week later, and the page states the date and time it will happen.
10. The user receives a second email confirming the date and carrying a link to cancel the deletion.

During the week:

1. The account stays signed in and can be used exactly as before: every channel is visible and usable, and logging in
   with the account's credentials keeps working.
2. The Account tab states that the deletion is scheduled, for when, and offers "Cancel deletion".

Cancel the deletion:

1. User clicks "Cancel deletion" in the settings page, or opens the cancel link from the second email.
2. The schedule is cleared and a notification confirms it.
3. Nothing else changes, because nothing had been removed.

Branches:

* **User cancels the confirmation** (step 3) — the modal closes and nothing happens.
* **Expired or invalid link** (step 8) — the page explains what happened. There is deliberately no "resend" button, so
  account deletion is not encouraged.
* **The window passes** (after step 10) — the account, all its channels and all their data are deleted permanently,
  every session stops working, and the user lands on the sign-up page on the next request.
* **A channel of the account has its own deletion scheduled** — the two are independent. Whichever runs first runs;
  cancelling the account's deletion does not cancel a channel's
  ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)).

**Acceptance criteria**

Requesting:

* The "Delete account" button is in the Account tab of the settings page and is styled as destructive.
* Deleting requires a confirmation modal that states the consequences — including that it removes every channel of the
  account — with the confirm button disabled for 10 seconds and a visible countdown.
* Confirming in the modal schedules nothing yet — it only sends the confirmation email.
* The confirmation link is valid for 5 minutes and works once.
* An expired or invalid link shows a clear message and offers no way to resend it.
* Opening a valid link schedules the deletion for one week later and states the date and time.
* A second email confirms that date and carries a link to cancel the deletion, valid until the deletion happens.
* Requesting the deletion does not end any session — the user stays signed in.

During the window:

* The account and every one of its channels stay fully usable, with nothing hidden and nothing restricted.
* Logging in with the account's credentials keeps working, as does everything else the account can normally do.
* The Account tab states that a deletion is scheduled, when it will happen, and offers "Cancel deletion".
* Cancelling from the settings page or from the email link clears the schedule and leaves the account exactly as it
  was.
* After cancelling, the account can be scheduled for deletion again in the same way.

The deletion itself:

* Once the week has passed, the account, all its channels and all their data are gone for good, with no way to restore.
* Every session of the account stops working at that point — no device stays signed in
  ([US-Auth-05](../auth/US-Auth-05-Session-management.md)).
* The email address becomes free for registration again only once the deletion has run.

**Tech notes**

* The schedule works exactly as in [US-Channels-06](../channels/US-Channels-06-delete-own-channel.md):
  `deletion_scheduled_at` on the account row is the source of truth, a BullMQ delayed job triggers the purge, and a
  periodic sweep picks up rows whose job was lost. Cancelling removes the job and clears the column.
* Account deletion is channel deletion fanned out over every channel of the account, plus the account itself — the
  same per-channel purge is reused rather than a second deletion path being written. The full list of what a channel's
  purge removes is in [US-Channels-06](../channels/US-Channels-06-delete-own-channel.md) and is not repeated here.
* Every service deletes the data it owns and reports back, so the purge is a saga across services, not a single
  transaction, and every step has to be idempotent since it may be retried.
* Nothing is hidden during the window, so no service needs a "scheduled for deletion" notion — the reasoning is the
  same as for channels, and it is what keeps counters and listings in agreement throughout the week.
* The identity lives in Keycloak, so the purge deletes the Keycloak user as well, not only the platform's own records.
  That is also what ends every session: the tokens have no user left to belong to.
* The email address needs no reservation of its own: the account is live until the purge, so nothing else can register
  on that address in the meantime, and it becomes free the moment the account is gone.
* An account scheduled for deletion is still a normal account for everything else, including data export
  ([US-Account-04](./US-Account-04-Download-own-user-data.md)) — which is worth keeping in mind as the one way a user
  takes their data with them before the window closes.
* Both emails go through the custom email module, the same one used for account confirmation
  ([US-Auth-02](../auth/US-Auth-02-Account-confirmation.md)).
* The confirmation token is single-use with a 5-minute lifetime and belongs server-side (Redis fits). The cancel token
  has to survive until the deletion happens, so it lives with the scheduled deletion rather than in a short-lived
  store.

**Links**

* [US-Account-04 — Download own user data](./US-Account-04-Download-own-user-data.md)
* [US-Auth-02 — Account confirmation](../auth/US-Auth-02-Account-confirmation.md)
* [US-Auth-05 — Session management](../auth/US-Auth-05-Session-management.md)
* [US-Channels-03 — Current channel settings](../channels/US-Channels-03-current-channel-settings.md)
* [US-Channels-06 — Delete own channel](../channels/US-Channels-06-delete-own-channel.md)

**Tasks**

BE:

* TODO

FE:

* TODO
