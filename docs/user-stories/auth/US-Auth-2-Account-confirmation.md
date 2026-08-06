## US-Auth-2 — Account confirmation

**Description**

As a registered user with an unconfirmed account, I want to confirm my email address via a link sent to my inbox, so
that I can prove the address is mine and get access to the platform.

**User flows**

Confirmation right after account creation — main flow:

1. User is redirected to the confirmation page.
2. User sees a message saying a confirmation link has been sent to their email, along with a "Resend link" button.
3. The resend button is disabled and shows a timer counting down to the next allowed attempt.
4. User opens the link from the email, which leads to the Keycloak verification page.
5. The account is confirmed.
6. User is redirected to the homepage and sees a success notification.

Confirmation right after account creation — branches:

* **Resend** (step 3) — once the timer runs out, the user clicks "Resend link"; the server sends a new email, the user
  sees a confirmation notification, and the button becomes disabled with the timer restarted.
* **Page reload** (steps 2-3) — the app fetches the confirmation status from the server and either shows the correct
  remaining time next to the resend button, or redirects to the homepage if the account is already confirmed.
* **Expired or invalid link** (step 4) — the user is returned to the confirmation page with a message explaining what
  happened (e.g. "This link has expired") and the resend button available.

Returning to the confirmation page:

1. A user with an unconfirmed account either logs in, or opens any page that requires authentication.
2. The app redirects them to the confirmation page with a message saying they need to confirm the account to continue.
3. From here the flow is the same as above.

**Acceptance criteria**

* A confirmation email with a verification link is sent right after account creation.
* The confirmation page states that the link has been sent and to which email address.
* The resend button is disabled with a visible countdown until the next attempt is allowed; the initially sent email
  counts as the first attempt.
* Clicking resend sends a new email, shows a notification, and restarts the cooldown.
* The cooldown is enforced on the server — reloading the page does not reset it, and the UI shows the actual remaining
  time returned by the server.
* Opening a valid link confirms the account, redirects to the homepage and shows a success notification once (it does
  not reappear on reload).
* Opening an expired or invalid link returns the user to the confirmation page with a message explaining the reason and
  the option to resend.
* Users with an unconfirmed account cannot access pages that require authentication — they are redirected to the
  confirmation page.
* Confirmation links are short-lived.
* Reloading the confirmation page with an already confirmed account redirects to the homepage.

**Tech notes**

* Keycloak provides email verification out of the box, including the verification page and link handling — use it
  instead of building a custom flow.
* Resend cooldown and link lifetime need a decided value (the original draft used 5 minutes for both).

**Links**

* [Keycloak](https://www.keycloak.org/)
* [US-Auth-1 — Account creation and login](./US-Auth-1-Account-creation-and-login.md)

**Tasks**

BE:

* TODO

FE:

* TODO