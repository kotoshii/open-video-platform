## auth-api: Implement POST /auth/email-confirmation/confirm

Needs: [Task-02 — auth-api: Send a confirmation email after sign-up](Task-02-auth-api-Send-a-confirmation-email-after-sign-up.md),
[US-Auth-01 Task-06 — auth-api: Return the token pair in httpOnly cookies](../../US-Auth-01/backend/Task-06-auth-api-Return-the-token-pair-in-httpOnly-cookies.md)

`POST /auth/email-confirmation/confirm` — body `{ token }`

Main flow:

1. Look the token up in Redis and delete it, so it works once.
2. Mark the user's email as verified in Keycloak.
3. Issue a fresh token pair and return it in cookies.

Branch — the token is unknown or expired:

1. Return its code, which the page turns into "this link has expired", with the resend still offered.

The route is public at the gateway, since the link may be opened in a browser nobody is signed in on. Keycloak's own
"Verify Email" required action stays off, or Keycloak refuses to issue tokens to a user whose email is unconfirmed.

Why: `email_verified` travels in the token, so without a fresh pair the features that need a confirmed email stay
unavailable until the token happens to refresh.
