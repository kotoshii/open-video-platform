## US-Auth-3 — Password reset

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
5. User opens the link from the email and lands on the Keycloak-hosted password update form.
6. User enters a new password and its confirmation, then submits the form.
7. User is redirected to the login page and sees a "Password changed successfully" notification.

Password reset — branches:

* **Invalid email format** (step 3) — the user sees a field-level error; no request is sent.
* **Cooldown still active** (step 3) — the server rejects the request and returns the remaining time; the UI shows a
  message with the actual countdown instead of sending a new email.
* **Expired or invalid reset link** (step 5) — the user sees a message explaining what happened and can request a new
  link.
* **Password does not meet the rules** (step 6) — the form shows an error and the user stays on it.

**Acceptance criteria**

* The login form has a "Forgot password?" link leading to the password reset page.
* Requesting a reset sends an email with a Keycloak-generated reset link.
* After a request, the button is disabled and shows a countdown until the next attempt is allowed.
* The cooldown is enforced on the server: reloading the page does not reset it, and a repeated request before it expires
  returns the actual remaining time, which the UI shows.
* The response to a reset request does not reveal whether the email is registered.
* Reset links are short-lived; an expired or invalid link shows a clear message with the option to request a new one.
* The password update form validates password strength and confirmation, using the same rules as sign-up.
* After a successful update, the user is redirected to the login page and sees a success notification once (it does not
  reappear on reload).
* The user can log in with the new password, and the old password no longer works.

**Tech notes**

* Keycloak covers password reset out of the box, including link generation and the password update form.
* The Keycloak-hosted pages are customizable — they must follow the app's styling and support the app's languages.
* Reset request state is not persisted on the client between page reloads; the server is the source of truth for the
  remaining cooldown.
* Cooldown and link lifetime need a decided value (the story suggests ~10 minutes for the cooldown).

**Links**

* [Keycloak](https://www.keycloak.org/)
* [US-Auth-1 — Account creation and login](./US-Auth-1-Account-creation-and-login.md)

**Tasks**

BE:

* TODO

FE:

* TODO