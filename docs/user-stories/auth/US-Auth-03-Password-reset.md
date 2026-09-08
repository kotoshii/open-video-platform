## US-Auth-03 — Password reset

**Description**

As a registered user who forgot their password, I want to reset it via a link sent to my email, so that I can regain
access to my account without contacting support.

**User flows**

Password reset — main flow:

1. User clicks the "Forgot password?" link in the login form.
2. User lands on the password reset page: an email input and a "Request password reset" button.
3. User enters their email and clicks the button.
4. The app shows a message saying the reset link has been sent; the button is disabled and shows a countdown to the next
   allowed attempt.
5. User opens the link from the email and lands on the custom-built (not Keycloak's) password update form.
6. User enters a new password and its confirmation, then submits the form.
7. The password is updated and every session of the account is ended.
8. User is redirected to the login page and sees a "Password changed successfully" notification.

Password reset — branches:

* **Invalid email format** (step 3) — the user sees a field-level error; no request is sent.
* **Cooldown still active** (step 3) — the server rejects the request and returns the remaining time; the UI shows a
  message with the actual countdown instead of sending a new email.
* **Expired or invalid reset link** (step 5) — the user sees a message explaining what happened and can request a new
  link.
* **Password does not meet the rules** (step 6) — the form shows an error and the user stays on it.

**Acceptance criteria**

* The login form has a "Forgot password?" link leading to the password reset page.
* Requesting a reset sends an email with a reset link.
* After a request, the button is disabled and shows a countdown until the next attempt is allowed.
* The cooldown is enforced on the server: reloading the page does not reset it, and a repeated request before it expires
  returns the actual remaining time, which the UI shows.
* The response to a reset request does not reveal whether the email is registered.
* Reset links are short-lived; an expired or invalid link shows a clear message with the option to request a new one.
* The password update form validates password strength and confirmation, using the same rules as sign-up.
* After a successful update, the user is redirected to the login page and sees a success notification once (it does not
  reappear on reload).
* The user can log in with the new password, and the old password no longer works.
* Resetting the password ends every session of the account — every device has to log in again with the new password.

**Tech notes**

* Keycloak covers password reset out of the box, including link generation and the password update form — do not use
  it, build the flow on the custom email module instead (same decision as in
  [US-Auth-02](US-Auth-02-Account-confirmation.md)).
* The API issues its own single-use, short-lived reset token, and applies the new password to Keycloak through the admin
  API once the form is submitted.
* The reset also ends every session of the account through Keycloak, the same mechanism as in
  [US-Auth-05](US-Auth-05-Session-management.md) — a forgotten password is exactly the case where an existing session
  may not belong to the owner. This matches changing the password from the settings page
  ([US-Account-03](../account/US-Account-03-Change-password.md)).
* Keep the reset token and the cooldown server-side (Redis fits — both are short-lived and TTL-based).
* Sending is handled by the email module and triggered by an event, not by an inline call inside the reset request; the
  response must not depend on mail delivery, and must not reveal whether the email is registered either way.
* The password update form is a normal app page, so it inherits the app's styling, error handling and languages — no
  separate theming of the identity provider's pages is needed.
* Reset request state is not persisted on the client between page reloads; the server is the source of truth for the
  remaining cooldown.
* Cooldown and link lifetime need a decided value (the story suggests ~10 minutes for the cooldown).

**Links**

* [Keycloak](https://www.keycloak.org/)
* [US-Auth-01 — Account creation and login](US-Auth-01-Account-creation-and-login.md)
* [US-Auth-02 — Account confirmation](US-Auth-02-Account-confirmation.md)
* [US-Auth-05 — Session management](US-Auth-05-Session-management.md)
* [US-Account-03 — Change password](../account/US-Account-03-Change-password.md)

**Tasks**

BE:

* TODO

FE:

* TODO