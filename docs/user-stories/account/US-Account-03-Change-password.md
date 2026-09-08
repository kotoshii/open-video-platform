## US-Account-03 — Change password

**Description**

As a registered user with a verified account, I want to change my password from the settings page, so that I can keep my
account secure without going through the password reset flow.

**User flows**

Change password — main flow:

1. User opens the settings page on the Account tab
   ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)).
2. User sees the "Current password", "New password" and "Confirm password" inputs.
3. Under them there is a hint saying that changing the password ends every active session, so the user will have to sign
   in again.
4. User enters the current password, the new password and its confirmation.
5. The fields are validated — if the new password and its confirmation do not match, or the password requirements are
   not met, the corresponding errors are shown under the fields.
6. User clicks "Save".
7. The "Save" button becomes disabled and shows a countdown to the next allowed attempt (5 minutes).
8. User receives a confirmation email with a link.
9. User opens the link, which lives for 5 minutes.
10. If the link is valid, the password is changed and every session of the account is ended.
11. A dedicated page opens saying the password has been changed, with a password input, since the user is no longer
    signed in anywhere.
12. User re-enters the new password, gets a new token pair, and is redirected to the homepage.
13. From this point the new password works for logging in and the old one stops working.

Change password — branches:

* **Passwords do not match or the requirements are not met** (step 5) — the corresponding errors are shown under the
  fields and the request is not sent.
* **Wrong current password** (step 6) — the server rejects the request, the field shows an error, and no confirmation
  email is sent.
* **Page reload while the cooldown is running** (step 7) — the state is loaded from the server, so the "Save" button
  comes back disabled with the actual remaining time instead of a reset timer.
* **Expired or invalid link** (step 9) — the page explains what happened. There is no resend button; the user starts
  over from the settings page.
* **Wrong password on the confirmation page** (step 12) — the page shows an error and the user tries again; the change
  itself has already been applied, so only the new password works.

**Acceptance criteria**

* The Account tab has "Current password", "New password" and "Confirm password" inputs.
* The hint under them explains that the change ends every active session.
* The new password and its confirmation must match, and the password must meet the same rules as on sign-up
  ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)) and password reset
  ([US-Auth-03](../auth/US-Auth-03-Password-reset.md)); errors are shown under the corresponding fields.
* A wrong current password is rejected with a field-level error, and no confirmation email is sent.
* Saving sends a confirmation email and changes nothing yet.
* After a request, "Save" is disabled and shows a countdown until the next attempt is allowed.
* The cooldown is enforced on the server — reloading the page does not reset it, and the UI shows the actual remaining
  time returned by the server.
* The confirmation link is valid for 5 minutes and works once.
* Opening a valid link applies the new password and ends every session of the account.
* The confirmation page states that the password has been changed and asks for the new password; entering it signs the
  user in again with a new token pair and redirects to the homepage.
* The confirmation page has no "Open homepage" button — the user continues by signing in.
* An expired or invalid link shows a clear message and offers no resend.
* After the change, the user can log in with the new password and the old password no longer works.
* Every other device is signed out and has to log in again, with the new password.

**Tech notes**

* The current password is verified on the server when "Save" is pressed, before anything else happens — an open session
  alone must not be enough to trigger a password change.
* The new password is applied only when the token from the confirmation email is consumed.
* Where the pending new password is held until then needs a decision: stored hashed and short-lived next to the token,
  or not stored at all, since the confirmation page asks the user to type it again anyway and could apply it from there.
* The password lives in Keycloak, so the change is applied there through the admin API, the same way as in
  [US-Auth-03](../auth/US-Auth-03-Password-reset.md).
* Changing the password ends every session of the account, the current one included; sessions are ended through
  Keycloak, the same mechanism as in [US-Auth-05](../auth/US-Auth-05-Session-management.md).
* No Kafka event is needed here: no service other than Keycloak stores the password.
* The confirmation token is single-use with a 5-minute lifetime, and the cooldown is enforced server-side; keep both
  there (Redis fits — short-lived and TTL-based), following the same pattern as
  [US-Auth-02](../auth/US-Auth-02-Account-confirmation.md) and [US-Auth-03](../auth/US-Auth-03-Password-reset.md).
* The email goes through the custom email module.

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
