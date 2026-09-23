## auth-api: Implement GET /auth/sessions

Needs: [Task-01 — auth-api: Store device and location for each session](Task-01-auth-api-Store-device-and-location-for-each-session.md)

`GET /auth/sessions`

Main flow:

1. Ask Keycloak for the account's active sessions, with their creation and last-used times.
2. Join each one with its stored device and location.
3. Mark the session whose id matches the token's `sid` as the current one, and return it first.

Branch — a session has no stored row:

1. Return it with what Keycloak knows and no device or location.

Branch — a stored row has no session in Keycloak any more:

1. Delete the row. Logging out, a password reset or an email change end sessions without touching the rows, so the
   list is where they are cleaned up.

Why: Keycloak decides which sessions exist, so the list cannot be built from our own rows — they only add what Keycloak
never had.
