## auth-api: Implement POST /auth/email-change/confirm

Needs: [Task-01 — auth-api: Implement POST /auth/email-change](Task-01-auth-api-Implement-POST-auth-email-change.md)

`POST /auth/email-change/confirm` — body `{ token }`

Main flow:

1. Consume the token from Redis, so the link works once.
2. Check the new address is still free.
3. Change the account's email in Keycloak and keep it verified. The email is the login identifier, so check that the
   realm keeps the username in step with it.
4. End every session of the account in Keycloak, the current one included.
5. Publish the notice to the old address — no link in it — and add its template in both languages.
6. Return the new address.

Branch — the token is unknown or expired:

1. Return its code; the page offers no resend.

Branch — the address was taken in the meantime:

1. Return its code; nothing changes.

The route is public at the gateway.

Why: the tokens were issued for the old identity and must not outlive it, so the page asks for the password to sign in
again. No Kafka event goes out: only Keycloak stores the address, and the email worker asks `auth-api` for it at the
moment it sends.
