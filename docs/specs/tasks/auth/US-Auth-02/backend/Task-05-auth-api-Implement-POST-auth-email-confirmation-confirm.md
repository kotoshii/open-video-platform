## auth-api: Implement POST /auth/email-confirmation/confirm

Needs: [Task-02 — auth-api: Send a confirmation email after sign-up](Task-02-auth-api-Send-a-confirmation-email-after-sign-up.md),
[US-Auth-01 Task-06 — auth-api: Return the token pair in httpOnly cookies](../../US-Auth-01/backend/Task-06-auth-api-Return-the-token-pair-in-httpOnly-cookies.md)

`POST /auth/email-confirmation/confirm` — body `{ token }`

Main flow:

1. Look the token up in Redis and check it belongs to the account in `User-ID`; then delete it, so it works once.
2. Mark the user's email as verified in Keycloak.
3. Refresh the current session and return the new token pair in cookies.

Branch — the token is unknown or expired:

1. Return its code, which the page turns into "this link has expired", with the resend still offered.

Branch — the token belongs to another account:

1. Return its code; the token stays usable, and the page says the link belongs to another account.

The route needs a session like any other: a browser without one is sent to log in first and brought back to the link
([US-Auth-04](../../../../user-stories/auth/US-Auth-04-Session-persistence.md)). Keycloak's own "Verify Email" required
action stays off, or Keycloak refuses to issue tokens to a user whose email is unconfirmed.

Why: `email_verified` travels in the token, so without a fresh pair the features that need a confirmed email stay
unavailable until the token happens to refresh.
