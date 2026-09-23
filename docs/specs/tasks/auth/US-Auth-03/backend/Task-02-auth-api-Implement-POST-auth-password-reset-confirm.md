## auth-api: Implement POST /auth/password-reset/confirm

Needs: [Task-01 — auth-api: Implement POST /auth/password-reset/request](Task-01-auth-api-Implement-POST-auth-password-reset-request.md)

`POST /auth/password-reset/confirm` — body `{ token, password }`

Main flow:

1. Check the new password against the sign-up rules.
2. Look the token up in Redis and delete it, so it works once.
3. Set the new password in Keycloak and mark the email as verified in the same update.
4. End every session of the account in Keycloak.

Branch — the token is unknown or expired:

1. Return its code; the page offers to request a new link.

Branch — the password does not meet the rules:

1. Return the field-level error, and leave the token usable so the user can try again.

The route is public at the gateway: its user cannot log in.

Why: following the emailed link is the same proof account confirmation asks for, so a reset confirms the email rather
than making the user do it twice. Every session ends because a forgotten password is exactly the case where an open
session may not belong to the owner.
