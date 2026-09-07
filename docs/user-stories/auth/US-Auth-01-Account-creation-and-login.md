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
6. User sees a notification that the account has been created.
7. User is redirected to the account verification screen (see [US-Auth-2](US-Auth-02-Account-confirmation.md)).

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

* **Invalid credentials** (step 4) — the user sees an error message and stays on the form.
* **Account not verified** (step 4) — the user is taken to the account verification screen and goes through the
  verification flow ([US-Auth-2](US-Auth-02-Account-confirmation.md)); they can continue only once the account is
  verified.
* **Multiple channels on the account** (step 5) — the user is prompted to select a channel before being redirected to
  the homepage.
* **Forgot password** (step 2) — the user follows the "Forgot password?" link and continues with the password reset flow
  ([US-Auth-3](US-Auth-03-Password-reset.md)).

**Acceptance criteria**

Account creation:

* A user can create an account with email, channel name, date of birth and password.
* All sign-up form fields are validated on the client, with an error message shown under each invalid field.
* Password strength is validated (minimum 8 characters).
* Password confirmation must match the password.
* Registering with an email that already exists returns `409` and is shown as a field-level error.
* The date of birth field has a tooltip explaining why the platform collects it.
* The user sees a notification on successful account creation, and an error notification when it fails.
* After successful creation, the user lands on the account verification screen.

Login:

* A user can log in to an existing account with email and password.
* Logging in to an unverified account leads to the verification flow instead of the homepage.
* If the account has more than one channel, the user can pick which channel to log in as.
* After successful login, the user lands on the homepage.

Navigation between forms:

* The login form has "Don't have an account? Sign up" with a link to the sign-up form.
* The sign-up form has "Already have an account? Log in" with a link to the login form.
* The login form has a "Forgot password?" link to the password reset form.

**Tech notes**

* Use Keycloak in Docker as the identity provider.
* Account creation must also create the user's default channel — the two are part of one flow and must not end up out of
  sync.

**Links**

* [Figma mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=0-1&p=f&t=9Z8ONFvfqc16RRvP-0)
* [Keycloak](https://www.keycloak.org/)
* [US-Auth-2 — Account confirmation](US-Auth-02-Account-confirmation.md)
* [US-Auth-3 — Password reset](US-Auth-03-Password-reset.md)

**Tasks**

BE:

* TODO

FE:

* TODO