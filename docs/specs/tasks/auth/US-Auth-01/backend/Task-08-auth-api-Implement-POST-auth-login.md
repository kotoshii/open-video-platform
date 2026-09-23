## auth-api: Implement POST /auth/login

Needs: [Task-06 — auth-api: Return the token pair in httpOnly cookies](Task-06-auth-api-Return-the-token-pair-in-httpOnly-cookies.md)

`POST /auth/login` — body `{ email, password }`

Main flow:

1. Exchange the email and the password for a token pair with Keycloak's direct access grant.
2. Return the pair in cookies.

Branch — Keycloak rejects the credentials:

1. Return 401 with the code the login form shows, saying nothing about which half was wrong.

Branch — the account's email is not confirmed:

1. Log in as normal. The token says so in `email_verified`, and the app shows its banner
   ([US-Auth-02](../../../../user-stories/auth/US-Auth-02-Account-confirmation.md)).

The route is public at the gateway, like sign-up and refresh.

Why: Keycloak issues and counts the tokens, so this endpoint holds no credentials of its own and no attempt counter —
that is the realm's brute force protection.
