## US-Auth-04 — Session persistence

**Description**

As an authenticated user, I want my session to stay alive while I keep using the app and between visits, so that I don't
have to log in again after every short break or page reload.

**User flows**

Access token expires — main flow:

1. User is using the app.
2. The access token expires.
3. The app makes a request and receives `401`.
4. The app exchanges the refresh token for a new token pair and stores it.
5. The app retries the original request with the new access token.
6. User continues working, unaware anything happened.

Access token expires — branches:

* **Refresh token also expired** (step 4) — the refresh request fails with `401`; the app clears the stored tokens,
  redirects the user to the login page and explains that the session has expired. After logging in again, the user gets
  a new token pair and continues as before.
* **Several requests fail at once** (step 3) — the app refreshes the tokens only once; the remaining requests wait for
  the new token and are then retried.

Returning to the app after closing it:

1. User opens the app again, with a valid refresh token stored from the previous visit.
2. The app restores the session and refreshes the tokens if needed.
3. User lands on the app as an authenticated user, without logging in again.

Invalid token supplied:

1. A request arrives with a malformed, tampered with, or otherwise invalid token (e.g. sent manually from an API
   client).
2. The gateway validates the token and rejects the request with `401`.

**Acceptance criteria**

* An expired access token is refreshed automatically, without any visible interruption for the user.
* The request that triggered the refresh is retried afterwards, so no user action is lost.
* Several requests failing at the same time cause only one refresh; the rest wait for its result and are retried.
* Refresh tokens are rotated: every refresh returns a new pair, and the previous refresh token stops working.
* The session survives page reloads and app restarts as long as the refresh token is valid.
* When the refresh token is expired or rejected, the app clears the session, redirects to the login page and tells the
  user the session has expired. The exception is an account that has been deleted: its user goes to the sign-up page
  instead ([US-Account-01](../account/US-Account-01-Delete-own-account.md)).
* A visitor with no session who opens a page that needs one goes straight to the login page, without the page
  rendering first. After logging in — and picking a channel, if the account has several
  ([US-Channels-07](../channels/US-Channels-07-channel-selection-page.md)) — they are brought back to the page they
  opened, and its flow continues. This holds for every such page, the ones opened from email links included.
* Only the auth pages and two email-link pages work without a session: the password reset page, since its user cannot
  log in, and the email change confirmation page, since the change ends every session and the page then asks for the
  password anyway ([US-Account-02](../account/US-Account-02-Change-email.md)).
* The app never shows a raw `401` to the user — it either refreshes silently or redirects to login.
* The server rejects requests with a missing, malformed, expired or invalid signature token with `401`.
* Token validation happens against the identity provider's public keys, not a shared secret.
* Tokens are kept in httpOnly cookies and are never accessible to client-side JavaScript.
* Logging in again after an expired session restores normal access.

**Tech notes**

* Keycloak provides the JWKS endpoint for signature validation and the token endpoint for exchanging a refresh token for
  a new pair — no custom token issuing logic is needed.
* The nginx gateway verifies every access token against Keycloak's JWKS keys, cached and fetched again when it meets
  an unknown key, and passes the result to the services as headers — `User-ID`, `Channel-ID`, `Session-ID`,
  `Birthdate`, `Email-Verified` ([infrastructure.md](../../infrastructure.md)). Services never parse tokens. Login,
  sign-up, refresh, the password reset routes and the email change confirmation are public; every other route needs a
  valid token.
* The access token lives **5 minutes**. The session survives up to **30 days without activity**: every refresh rotates
  the refresh token and restarts that window, so someone who uses the app at least monthly never has to log in again.
* There is **no "remember me" option** — every login stays signed in the same way. No story asks for one, and a short
  access token is what keeps the gap between "session ended" and "actually cut off" small
  ([US-Auth-05](US-Auth-05-Session-management.md)).
* In Keycloak these are realm settings: Access Token Lifespan 5 minutes, SSO Session Idle 30 days. **SSO Session Max
  has to be raised as well** — its default of 10 hours ends every session after a working day, however active the user
  is, which silently undoes the 30 days.
* Tokens are stored in httpOnly cookies — not in localStorage or any other storage reachable from JS. Set
  `Secure`, `SameSite` and a path scoped to the refresh endpoint where it makes sense. Since the cookies are not
  readable by the client, the app decides when to refresh by the `401` response, not by inspecting token expiry.
* Single-flight refresh for the "several requests fail at once" branch: keep one shared refresh promise in the API
  client. The first `401` starts the refresh and stores the promise; every other request that gets a `401` while it is
  pending awaits the same promise instead of starting its own, then retries. Clear the promise once it settles, retry
  each request only once to avoid loops, and on failure reject all waiting requests and redirect to login.

**Links**

* [Keycloak](https://www.keycloak.org/)
* [US-Auth-05 — Session management](US-Auth-05-Session-management.md)
* [US-Auth-06 — Logging out](US-Auth-06-Logging-out.md)

**Tasks**

BE:

* [Task-01 — Set the Keycloak token and session lifespans](../../tasks/auth/US-Auth-04/backend/Task-01-Set-the-Keycloak-token-and-session-lifespans.md)
* [Task-02 — auth-api: Implement POST /auth/refresh](../../tasks/auth/US-Auth-04/backend/Task-02-auth-api-Implement-POST-auth-refresh.md)
* [_platform infrastructure Task-17 — Verify access tokens in the gateway](../../tasks/_platform/infrastructure/Task-17-Verify-access-tokens-in-the-gateway.md)

FE:

* [Task-03 — Redirect a visitor with no session to login](../../tasks/auth/US-Auth-04/frontend/Task-03-Redirect-a-visitor-with-no-session-to-login.md)
* [_platform frontend Task-04 — Add single-flight token refresh to the API client](../../tasks/_platform/frontend/Task-04-Add-single-flight-token-refresh-to-the-API-client.md)