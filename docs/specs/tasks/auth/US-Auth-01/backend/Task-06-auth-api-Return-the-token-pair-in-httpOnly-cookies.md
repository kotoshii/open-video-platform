## auth-api: Return the token pair in httpOnly cookies

Needs: [Task-01 — Migrate auth-api to the new structure](Task-01-Migrate-auth-api-to-the-new-structure.md)

Write the one place in `auth-api` that puts a Keycloak token pair on a response as cookies, and the one that clears
them: both httpOnly, with `Secure` and `SameSite` set, and the refresh cookie scoped by path to `/api/auth`, which
covers refreshing and changing the password
([US-Auth-04](../../../../user-stories/auth/US-Auth-04-Session-persistence.md)).
Set and clear a third cookie with them: a plain session marker on the whole site, holding no token, which the app's
middleware reads to tell whether anyone is signed in.

Every endpoint that signs someone in or out uses it — sign-up, login, refresh, confirming an email
([US-Auth-02](../../../../user-stories/auth/US-Auth-02-Account-confirmation.md)) and logging out.

Why: a token the browser holds but JavaScript cannot read is only safe if every response sets it the same way, so this
is written once rather than per endpoint. The marker exists because the refresh token is scoped to `/api/auth` and
never reaches page requests, so the middleware could not see it.
