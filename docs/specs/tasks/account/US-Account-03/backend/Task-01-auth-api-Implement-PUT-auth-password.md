## auth-api: Implement PUT /auth/password

Needs: [US-Auth-05 Task-04 — auth-api: Implement DELETE /auth/sessions/others](../../../auth/US-Auth-05/backend/Task-04-auth-api-Implement-DELETE-auth-sessions-others.md)

`PUT /auth/password` — body `{ currentPassword, newPassword }`

Main flow:

1. Check the new password against the sign-up rules.
2. Verify the current password with Keycloak's direct grant, and end the session that check opens straight away.
3. Set the new password through the admin API.
4. End every other session of the account, keeping the token's `sid` — the same as `DELETE /auth/sessions/others`.
5. Refresh the current session and return the new pair in cookies.

Branch — the current password is wrong:

1. A field-level error. Nothing is changed and no session is ended.

Branch — the new password breaks the rules:

1. The field-level errors.

Why: an open session alone must not be enough to change credentials, so the current password is checked against
Keycloak. Checking it with the same direct grant login uses means the realm's brute force protection counts failures
here too — no counter of our own — and while it locks the account, logging in is locked as well.
