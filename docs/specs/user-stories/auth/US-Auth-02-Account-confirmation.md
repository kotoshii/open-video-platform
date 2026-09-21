## US-Auth-02 — Account confirmation

**Description**

As a registered user with an unconfirmed email, I want to confirm my email address via a link sent to my inbox, so
that I can prove the address is mine and use the features that depend on it.

Confirming is not required to use the app. An unconfirmed user can do everything — watch, upload, comment, subscribe —
except the few things that rely on the inbox actually belonging to them: deleting a channel or the account, and
receiving notification emails.

**User flows**

Confirmation right after account creation — main flow:

1. User is redirected to the confirmation page.
2. User sees a message saying a confirmation link has been sent to their email, along with a "Resend link" button and a
   "Continue to the app" action.
3. The resend button is disabled and shows a timer counting down to the next allowed attempt.
4. User opens the link from the email, which leads to the custom-built verification page (not Keycloak's pre-built).
5. The email is confirmed.
6. User is redirected to the homepage and sees a success notification.

Confirmation right after account creation — branches:

* **Continue without confirming** (step 2) — the user goes to the homepage and uses the app as normal; a banner reminds
  them to confirm the email.
* **Resend** (step 3) — once the timer runs out, the user clicks "Resend link"; the server sends a new email, the user
  sees a confirmation notification, and the button becomes disabled with the timer restarted.
* **Page reload** (steps 2-3) — the app fetches the confirmation status from the server and either shows the correct
  remaining time next to the resend button, or redirects to the homepage if the email is already confirmed.
* **Expired or invalid link** (step 4) — the user is returned to the confirmation page with a message explaining what
  happened (e.g. "This link has expired") and the resend button available.

Coming back to confirm later:

1. While the email is unconfirmed, a banner at the top of every page says so, with a link to the confirmation page
   ([US-UI-UX-03](../ui-ux/US-UI-UX-03-Global-layout.md)).
2. The user follows it, and from there the flow is the same as above.

Trying something that needs a confirmed email:

1. The user tries to delete a channel or the account, or to turn on a notification email.
2. The action is unavailable, with a note saying the email has to be confirmed first and a link to the confirmation
   page ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md),
   [US-Account-01](../account/US-Account-01-Delete-own-account.md),
   [US-Notifications-01](../notifications/US-Notifications-01-Notifications-config.md)).

**Acceptance criteria**

* A confirmation email with a verification link is sent right after account creation.
* The confirmation page states that the link has been sent and to which email address.
* The confirmation page lets the user continue into the app without confirming.
* The resend button is disabled with a visible countdown until the next attempt is allowed; the initially sent email
  counts as the first attempt.
* Clicking resend sends a new email, shows a notification, and restarts the cooldown.
* The cooldown is enforced on the server — reloading the page does not reset it, and the UI shows the actual remaining
  time returned by the server.
* Opening a valid link confirms the email, redirects to the homepage and shows a success notification once (it does
  not reappear on reload).
* Opening an expired or invalid link returns the user to the confirmation page with a message explaining the reason and
  the option to resend.
* A user with an unconfirmed email can use the whole app, except:
    * deleting a channel ([US-Channels-06](../channels/US-Channels-06-delete-own-channel.md)) or the account
      ([US-Account-01](../account/US-Account-01-Delete-own-account.md));
    * turning on notification emails
      ([US-Notifications-01](../notifications/US-Notifications-01-Notifications-config.md)).
* Each of those is visibly unavailable while the email is unconfirmed, and says why.
* While the email is unconfirmed, a banner on every page says so and links to the confirmation page.
* Completing a password reset also confirms the email ([US-Auth-03](US-Auth-03-Password-reset.md)).
* Confirmation links are short-lived.
* Reloading the confirmation page with an already confirmed email redirects to the homepage.

**Tech notes**

* Keycloak provides email verification out of the box, including mail sending, link handling and the verification page
  — do not use it, build a custom email module instead. It is relatively simple, gives full control over the emailing
  flow and the email template design, and the module is needed anyway for the other confirmation emails (e.g. channel or
  account deletion).
* Keycloak's "Verify Email" required action must stay **off**, or Keycloak itself refuses to issue tokens to an
  unconfirmed user and the whole point of this story is lost.
* The API issues its own single-use, short-lived confirmation token, and marks the email as verified in Keycloak through
  the admin API once the token is consumed.
* **Why confirming is not required up front:** nothing in the feed, search, uploads, comments or subscriptions reads the
  email address or whether it is confirmed. The only features that need it are the ones that use the inbox as proof —
  a deletion confirmed by an emailed link would otherwise be at the mercy of whoever owns a mistyped address, and
  notification emails would go to an address nobody has proven. Gating those three places is simpler than checking the
  flag on every request and redirecting on every page.
* Whether the email is confirmed travels in the token as Keycloak's `email_verified` claim, so the features above read
  it from the token without a call to Keycloak.
* Confirming the email changes that claim, so **re-issue the token pair when the email is confirmed** — otherwise the
  deletion buttons stay disabled until the access token happens to refresh. Creating a channel re-issues tokens for the
  same reason ([US-Channels-01](../channels/US-Channels-01-create-multiple-channels.md)).
* **Unconfirmed accounts never expire**, so an address stays taken for as long as its account exists, confirmed or
  not. If someone signs up with an address that is not theirs, its real owner gets it back through password reset
  ([US-Auth-03](US-Auth-03-Password-reset.md)), which confirms the email — and takes over the account along with
  whatever was built on it.
* Keep the confirmation token and the resend cooldown server-side (Redis fits — both are short-lived and TTL-based).
* Sending is handled by the email module and triggered by an event, not by an inline call inside the sign-up request —
  account creation must not fail or block on mail delivery.
* Resend cooldown and link lifetime need a decided value (the original draft used 5 minutes for both).

**Links**

* [Keycloak](https://www.keycloak.org/)
* [US-Auth-01 — Account creation and login](US-Auth-01-Account-creation-and-login.md)
* [US-Auth-03 — Password reset](US-Auth-03-Password-reset.md)
* [US-UI-UX-03 — Global layout](../ui-ux/US-UI-UX-03-Global-layout.md)

**Tasks**

BE:

* TODO

FE:

* TODO
