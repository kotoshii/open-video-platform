## US-Account-01 — Delete own account

**Description**

As a registered user with a verified account, I want to delete my account together with all its channels, so that I and
everything I published disappear from the platform — with a window to change my mind before that becomes permanent.

**User flows**

Delete the account — main flow:

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
9. If valid, the account is deleted and the user is redirected to the sign-up page.
10. After the deletion, the user receives a second email saying they have a week to restore the account using the link
    in that email. After the week, the deletion is permanent.

Delete the account — branches:

* **User cancels the confirmation** (step 3) — the modal closes and nothing happens.
* **Expired or invalid link** (step 8) — the page explains what happened. There is deliberately no "resend" button, so
  account deletion is not encouraged.
* **Restore within the week** (step 10) — the user opens the restore link from the second email; the account, all its
  channels and their content become available again, and the user logs in as before.
* **Restore window passes** (step 10) — the account and all data of all its channels are deleted permanently, with no
  way to restore.

**Acceptance criteria**

* The "Delete account" button is in the Account tab of the settings page and is styled as destructive.
* Deleting requires a confirmation modal that states the consequences — including that it removes every channel of the
  account — with the confirm button disabled for 10 seconds and a visible countdown.
* Confirming in the modal deletes nothing yet — it only sends the confirmation email.
* The confirmation link is valid for 5 minutes and works once.
* An expired or invalid link shows a clear message and offers no way to resend it.
* After a successful deletion the user is redirected to the sign-up page.
* Deleting the account ends every session of the account — no device stays logged in
  ([US-Auth-05](../auth/US-Auth-05-Session-management.md)).
* While the account is soft deleted, logging in with its credentials is not possible.
* A second email confirms the deletion and carries a restore link valid for one week.
* Restoring within the week brings the account, all its channels and their content back as they were.
* Once the week has passed, the account and all data of all its channels are gone for good.

**Tech notes**

* The account is soft deleted first. While it is soft deleted, ALL channels of the account become unavailable, and so
  does everything they own — videos, subscriptions, comments. Videos of all channels stop being indexed and cannot be
  found through search.
* Account deletion is channel deletion ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)) fanned out
  over every channel of the account, plus the account itself — the same per-channel saga is reused rather than a second
  deletion path being written.
* Every service deletes the data it owns and reports back, so the purge is a saga across services, not a single
  transaction, and every step has to be idempotent since it may be retried.
* The purge is triggered a week after the soft delete by a scheduled job, not by the deletion request itself.
* The identity lives in Keycloak, so the purge has to delete the Keycloak user as well, not only the platform's own
  records.
* The email address stays reserved until the purge — otherwise a restore could collide with an account registered on
  the same address in the meantime.
* Both emails go through the custom email module, the same one used for account confirmation
  ([US-Auth-02](../auth/US-Auth-02-Account-confirmation.md)).
* The confirmation token is single-use with a 5-minute lifetime, the restore token lives for a week; both are kept
  server-side (Redis fits the short-lived one).

**Links**

* [US-Auth-02 — Account confirmation](../auth/US-Auth-02-Account-confirmation.md)
* [US-Auth-05 — Session management](../auth/US-Auth-05-Session-management.md)
* [US-Channels-03 — Current channel settings](../channels/US-Channels-03-current-channel-settings.md)
* [US-Channels-06 — Delete own channel](../channels/US-Channels-06-delete-own-channel.md)

**Tasks**

BE:

* TODO

FE:

* TODO
