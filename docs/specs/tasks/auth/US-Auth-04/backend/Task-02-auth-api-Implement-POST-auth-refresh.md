## auth-api: Implement POST /auth/refresh

Needs: [US-Auth-01 Task-06 — auth-api: Return the token pair in httpOnly cookies](../../US-Auth-01/backend/Task-06-auth-api-Return-the-token-pair-in-httpOnly-cookies.md)

`POST /auth/refresh`

Main flow:

1. Take the refresh token from its cookie.
2. Exchange it with Keycloak for a new pair. The old refresh token stops working.
3. Return the new pair in cookies.

Branch — Keycloak rejects the token, because it expired, was rotated already or its session was ended:

1. Clear both cookies and return 401, which is what sends the app to the login page.

The route is public at the gateway: the access token is expired by definition when this is called.

Why: rotating on every refresh means a stolen refresh token is worth something only until the owner's next refresh —
and it is exactly why the client must never run two refreshes at once
([_platform frontend Task-04](../../../_platform/frontend/Task-04-Add-single-flight-token-refresh-to-the-API-client.md)).
