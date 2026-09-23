## auth-api: Verify a password over gRPC

Needs: [US-Account-03 Task-01 — auth-api: Implement PUT /auth/password](../../US-Account-03/backend/Task-01-auth-api-Implement-PUT-auth-password.md)

Add the gRPC method that checks an account's password the way changing the password does: Keycloak's direct grant,
with the session it opens ended straight away. `account-api` calls it before every export.

Why: `account-api` cannot check a password itself — only `auth-api` talks to Keycloak. Going through the same direct
grant means the realm's brute force protection throttles failed attempts here exactly as for login and for changing the
password.
