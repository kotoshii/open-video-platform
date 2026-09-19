## US-Account-03 — Change password

**Description**

As a registered user with a verified account, I want to change my password from the settings page by confirming my
current one, so that I can rotate my password without going through the password reset flow.

**User flows**

Change password — main flow:

1. User opens the settings page on the Account tab
   ([US-Channels-03](../channels/US-Channels-03-current-channel-settings.md)).
2. User sees the "Current password", "New password" and "Confirm password" inputs.
3. Under them there is a hint saying that changing the password signs out every other device.
4. User enters the current password, the new password and its confirmation, then clicks "Save".
5. The app validates the fields.
6. The server verifies the current password and applies the new one.
7. Every other session of the account is ended; the current session gets a new token pair and stays signed in.
8. User sees a success toast and stays on the settings page, with the password fields cleared.
9. From this point the new password works for logging in and the old one stops working.

Change password — branches:

* **Passwords do not match or the requirements are not met** (step 5) — the corresponding errors are shown under the
  fields and the request is not sent.
* **Wrong current password** (step 6) — the field shows an error; nothing is changed and no session is ended.
* **Request fails** (step 6) — the default error flow applies
  ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)) and the password stays as it was.

**Acceptance criteria**

* The Account tab has "Current password", "New password" and "Confirm password" inputs.
* The hint under them explains that the change signs out every other device.
* The new password and its confirmation must match, and the password must meet the same rules as on sign-up
  ([US-Auth-01](../auth/US-Auth-01-Account-creation-and-login.md)) and password reset
  ([US-Auth-03](../auth/US-Auth-03-Password-reset.md)); errors are shown under the corresponding fields.
* The current password is what authorises the change — no email confirmation is involved anywhere in this story.
* A wrong current password is rejected with a field-level error and changes nothing.
* On success the user sees a success toast, stays on the settings page, and the password fields are cleared.
* The user is not signed out on this device — the current session continues with a new token pair.
* Every other session of the account is ended, so every other device has to log in again with the new password.
* The user can log in with the new password, and the old password no longer works.
* Failures follow the default error flow ([US-UI-UX-02](../ui-ux/US-UI-UX-02-User-friendly-errors.md)).

**Tech notes**

* No email confirmation here, deliberately. Password reset ([US-Auth-03](../auth/US-Auth-03-Password-reset.md)) needs an
  emailed link because the user cannot prove who they are — they forgot the password. Here the current password is that
  proof, so an email round-trip would only repeat the reset flow with extra steps.
* Because nothing is deferred to a link, there is no confirmation token, no cooldown and no pending password to hold
  anywhere — the change is applied within the request that submits the form.
* The current password is verified on the server against Keycloak, not merely against the presence of a valid session:
  an open session alone must not be enough to change credentials.
* The password lives in Keycloak, so the new one is set through the admin API, the same way as in
  [US-Auth-03](../auth/US-Auth-03-Password-reset.md).
* Ending the other sessions goes through Keycloak, the same mechanism as in
  [US-Auth-05](../auth/US-Auth-05-Session-management.md). The current session is kept and re-issued instead of ended, so
  the user is not thrown out of the page they are working on.
* Failed attempts against the "Current password" field need throttling — this form is the only credential check standing
  between an open session and a new password.
* No Kafka event is needed: no service other than Keycloak stores the password.

**Links**

* [US-Auth-01 — Account creation and login](../auth/US-Auth-01-Account-creation-and-login.md)
* [US-Auth-03 — Password reset](../auth/US-Auth-03-Password-reset.md)
* [US-Auth-05 — Session management](../auth/US-Auth-05-Session-management.md)
* [US-Channels-03 — Current channel settings](../channels/US-Channels-03-current-channel-settings.md)
* [US-UI-UX-02 — User-friendly error messages](../ui-ux/US-UI-UX-02-User-friendly-errors.md)

**Tasks**

BE:

* TODO

FE:

* TODO
