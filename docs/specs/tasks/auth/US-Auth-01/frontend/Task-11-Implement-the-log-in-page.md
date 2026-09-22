## Implement the log in page

Needs: [Task-08 — auth-api: Implement POST /auth/login](../backend/Task-08-auth-api-Implement-POST-auth-login.md),
[_platform frontend Task-03 — Create the API client](../../../_platform/frontend/Task-03-Create-the-API-client.md)

Build the log in page next to the sign-up one: email, password, a "Forgot password?" link
([US-Auth-03](../../../../user-stories/auth/US-Auth-03-Password-reset.md)) and a link to sign up.

Main flow:

1. User submits and the app calls the login endpoint.
2. The user lands on the homepage.

Branch — the credentials are wrong:

1. A message appears on the form and the user stays on it.

Branch — the email is not confirmed:

1. Nothing different here; the app shows the banner from
   [US-Auth-02](../../../../user-stories/auth/US-Auth-02-Account-confirmation.md).

Picking which channel to act as after logging in comes with
[US-Channels-07](../../../../user-stories/channels/US-Channels-07-channel-selection-page.md).
