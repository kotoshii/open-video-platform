## US-Auth-01 — Account creation and login

**Description**

As an unauthenticated user, I want to create an account with my email and password and log in to an existing one, so
that I can use the platform under my own identity.

**User flows**

Account creation — main flow:

1. User opens the auth page and switches to the sign-up form.
2. Enters the required details:
    * email address;
    * channel name (can be changed later);
    * date of birth — used to filter age-restricted content; the field has a tooltip explaining why we ask for it;
    * password;
    * password confirmation.
3. Clicks the "Create account" button.
4. The app validates the entered details.
5. The app calls the API to create the account.
6. User sees a notification that the account has been created, and is signed in.
7. User is redirected to the confirmation page ([US-Auth-02](US-Auth-02-Account-confirmation.md)), which says a
   confirmation link has been sent and lets them continue into the app straight away.

Account creation — branches:

* **Invalid input** (step 4) — the user sees an error message under each invalid field; the request is not sent.
* **Email already taken** (step 5) — the API responds with `409`; the user sees an error next to the email field and
  stays on the form.

Login — main flow:

1. User opens the auth page.
2. Enters email and password.
3. Clicks the "Log in" button.
4. The app calls the API to authenticate the user.
5. User is redirected to the homepage.

Login — branches:

* **Invalid credentials** (step 4) — the user sees an error message and stays on the form. The message does not say
  whether the email or the password was wrong.
* **Email not confirmed yet** (step 5) — the user logs in as normal. A banner reminds them to confirm the email
  ([US-Auth-02](US-Auth-02-Account-confirmation.md)); only the features that rely on the email wait for it.
* **Multiple channels on the account** (step 5) — the user is taken to the channel selection page
  ([US-Channels-07](../channels/US-Channels-07-channel-selection-page.md)) to pick a channel before being redirected
  to the homepage. An account with one channel goes straight to the homepage.
* **Forgot password** (step 2) — the user follows the "Forgot password?" link and continues with the password reset flow
  ([US-Auth-03](US-Auth-03-Password-reset.md)).

**Acceptance criteria**

Account creation:

* A user can create an account with email, channel name, date of birth and password.
* All sign-up form fields are validated on the client, with an error message shown under each invalid field.
* Password strength is validated (minimum 8 characters).
* Password confirmation must match the password.
* Registering with an email that already exists returns `409` and is shown as a field-level error.
* The date of birth field has a tooltip explaining why the platform collects it.
* The user sees a notification on successful account creation, and an error notification when it fails.
* After successful creation, the user is signed in and lands on the confirmation page, from which they can continue
  into the app without confirming first.

Login:

* A user can log in to an existing account with email and password.
* Logging in with an unconfirmed email works as normal; the app shows a banner asking the user to confirm it.
* If the account has more than one channel, the user picks which channel to act as on the channel selection page
  ([US-Channels-07](../channels/US-Channels-07-channel-selection-page.md)); with one channel the page is skipped.
* After successful login, the user lands on the homepage.

Navigation between forms:

* The login form has "Don't have an account? Sign up" with a link to the sign-up form.
* The sign-up form has "Already have an account? Log in" with a link to the login form.
* The login form has a "Forgot password?" link to the password reset form.

**Tech notes**

* Use Keycloak in Docker as the identity provider.
* Login uses the app's own form: `auth-api` exchanges the email and the password for tokens with Keycloak's direct
  access grant, so users never see Keycloak's pages. Repeated wrong passwords are throttled by the realm's brute force
  protection; there is no attempt counter of our own.
* Sign-up spans three services, so it is a **saga** run by `auth-api` ([service-map.md](../../service-map.md)):
    1. create the Keycloak user, with the date of birth stored as its `birthdate` attribute so it reaches the token;
    2. ask `account-api` to create the account record;
    3. ask `channel-api` to create the first channel;
    4. add the new channel's id to the user's `channelIds` attribute in Keycloak, so the first token already carries it
       ([US-Channels-01](../channels/US-Channels-01-create-multiple-channels.md));
    5. log the user in.

  If any step after the first fails, undo what was already done, ending with deleting the Keycloak user, so a failed sign-up never
  leaves an account without a channel or a Keycloak user without an account.
* The sign-up request also sends the currently selected interface language, which becomes the account's initial email
  language ([US-I18n-03](../i18n/US-I18n-03-Localized-emails.md)).

**Links**

* [Figma mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=0-1&p=f&t=9Z8ONFvfqc16RRvP-0)
* [Keycloak](https://www.keycloak.org/)
* [US-Auth-02 — Account confirmation](US-Auth-02-Account-confirmation.md)
* [US-Auth-03 — Password reset](US-Auth-03-Password-reset.md)

**Tasks**

BE:

* [Task-01 — Migrate auth-api to the new structure](../../tasks/auth/US-Auth-01/backend/Task-01-Migrate-auth-api-to-the-new-structure.md)
* [Task-02 — Migrate channel-api to the new structure](../../tasks/auth/US-Auth-01/backend/Task-02-Migrate-channel-api-to-the-new-structure.md)
* [Task-03 — Set up the Keycloak realm and its claims](../../tasks/auth/US-Auth-01/backend/Task-03-Set-up-the-Keycloak-realm-and-its-claims.md)
* [Task-04 — account-api: Create and delete the account over gRPC](../../tasks/auth/US-Auth-01/backend/Task-04-account-api-Create-and-delete-the-account-over-gRPC.md)
* [Task-05 — channel-api: Create and delete a channel over gRPC](../../tasks/auth/US-Auth-01/backend/Task-05-channel-api-Create-and-delete-a-channel-over-gRPC.md)
* [Task-06 — auth-api: Return the token pair in httpOnly cookies](../../tasks/auth/US-Auth-01/backend/Task-06-auth-api-Return-the-token-pair-in-httpOnly-cookies.md)
* [Task-07 — auth-api: Implement POST /auth/sign-up as a saga](../../tasks/auth/US-Auth-01/backend/Task-07-auth-api-Implement-POST-auth-sign-up-as-a-saga.md)
* [Task-08 — auth-api: Implement POST /auth/login](../../tasks/auth/US-Auth-01/backend/Task-08-auth-api-Implement-POST-auth-login.md)
* [Task-09 — auth-api: Implement GET /auth/current-user](../../tasks/auth/US-Auth-01/backend/Task-09-auth-api-Implement-GET-auth-current-user.md)

FE:

* [Task-10 — Implement the sign-up page](../../tasks/auth/US-Auth-01/frontend/Task-10-Implement-the-sign-up-page.md)
* [Task-11 — Implement the log in page](../../tasks/auth/US-Auth-01/frontend/Task-11-Implement-the-log-in-page.md)