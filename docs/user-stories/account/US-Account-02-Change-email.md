## US-Account-02 — Change email

**Description**

As a registered user with a verified account, I want to change the email address of my account, so that my account is
tied to an address I actually use.

**User flows**

Change email — main flow:

1. User opens the settings page on the Account tab
   ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)).
2. User sees the email input, pre-filled with the current email address.
3. Under the input there is a hint saying that a confirmation email will be sent, and that changing the address ends
   every active session, so the user will have to sign in again.
4. User enters a new email address and clicks "Save".
5. The "Save" button becomes disabled and shows a countdown to the next allowed attempt (5 minutes).
6. User receives a confirmation email with a link at the new address.
7. User opens the link, which lives for 5 minutes.
8. If the link is valid, the address is changed, every session of the account is ended, and a notification about the
   change is sent to the old address.
9. A dedicated page opens saying the email has been changed to `<new email>`, with a password input, since the user is
   no longer signed in anywhere.
10. User enters their password, gets a new token pair carrying the new email, and is redirected to the homepage.
11. From this point the new address is used for everything and the old one is no longer used.

Change email — branches:

* **Invalid email format** (step 4) — the field shows a validation error and the request is not sent.
* **Email already taken** (step 4) — the API responds with `409` and the user sees a field-level error, the same way as
  on sign-up ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)).
* **Page reload while the cooldown is running** (step 5) — the state is loaded from the server, so the "Save" button
  comes back disabled with the actual remaining time instead of a reset timer.
* **Expired or invalid link** (step 7) — the page explains what happened. There is no resend button; the user starts
  over from the settings page.
* **Wrong password on the confirmation page** (step 10) — the page shows an error and the user tries again; the email
  change itself has already been applied, so the sign-in has to use the new address.

**Acceptance criteria**

* The Account tab has an email input pre-filled with the current address.
* The hint under the input explains both that a confirmation email will be sent and that the change ends every active
  session.
* Saving a new address sends a confirmation email to that new address and changes nothing yet.
* After a request, "Save" is disabled and shows a countdown until the next attempt is allowed.
* The cooldown is enforced on the server — reloading the page does not reset it, and the UI shows the actual remaining
  time returned by the server.
* The confirmation link is valid for 5 minutes and works once.
* Opening a valid link changes the address, ends every session of the account, and sends a notification about the change
  to the old address.
* The confirmation page states the new address and asks for the password; entering it signs the user in again with a new
  token pair carrying the new email and redirects to the homepage.
* The confirmation page has no "Open homepage" button — the user continues by signing in.
* An expired or invalid link shows a clear message and offers no resend.
* After the change, the new address is used everywhere and the old one no longer works — for logging in or for anything
  else.
* Every other device is signed out and has to log in again, with the new address.
* An address already used by another account is rejected with a field-level error.

**Tech notes**

* The confirmation link goes to the **new** address — that is what proves the user owns it. The change is applied only
  when the token from that email is consumed.
* The email is the login identifier in Keycloak, so the change has to be applied there through the admin API, keeping
  the account verified — the new address is proven by our own confirmation token, so it must not fall back to
  unverified.
* Changing the login identifier ends every session of the account, the current one included: the issued tokens were
  minted for the old identity and must not outlive it. Sessions are ended through Keycloak, the same mechanism as in
  [US-Auth-05](../auth/US-Auth-05-Session-management.md).
* The password field on the confirmation page is a normal login against the new address — it is the only way back in,
  since the session that started the change is already gone.
* The notification to the old address is a notice only; it carries no action link.
* The confirmation token is single-use with a 5-minute lifetime, and the cooldown is enforced server-side; keep both
  there (Redis fits — short-lived and TTL-based), following the same pattern as
  [US-Auth-02](../auth/US-Auth-02-Account-confirmation.md) and [US-Auth-03](../auth/US-Auth-03-Password-reset.md).
* Both emails go through the custom email module.
* Whether a Kafka event is fired on an email update needs a decision — it depends on whether any service other than
  Keycloak keeps a copy of the address.

**Links**

* [US-Auth-01 — Account creation and login](../auth/US-Auth-01-Account-creation-and-login.md)
* [US-Auth-02 — Account confirmation](../auth/US-Auth-02-Account-confirmation.md)
* [US-Auth-03 — Password reset](../auth/US-Auth-03-Password-reset.md)
* [US-Auth-05 — Session management](../auth/US-Auth-05-Session-management.md)
* [US-Channels-03 — Current channel settings](../channels/US-Channels-03-current-channel-settings.md)

**Tasks**

BE:

* TODO

FE:

* TODO
