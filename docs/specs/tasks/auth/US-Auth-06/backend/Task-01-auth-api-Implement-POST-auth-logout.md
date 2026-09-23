## auth-api: Implement POST /auth/logout

Needs: [US-Auth-01 Task-06 — auth-api: Return the token pair in httpOnly cookies](../../US-Auth-01/backend/Task-06-auth-api-Return-the-token-pair-in-httpOnly-cookies.md)

`POST /auth/logout`

Main flow:

1. Take the session id from the `Session-ID` header the gateway set, which comes from the token's `sid` claim.
2. Delete that one session in Keycloak.
3. Clear the auth cookies on the response.

Branch — the session is already gone, because it was ended from another device:

1. Treat it as a success and clear the cookies anyway.

Why: deleting the session is what stops the refresh token working; clearing the cookies alone would leave it valid on
the server. Only this session ends — every other device keeps working, which is what separates logging out from
[US-Auth-05](../../../../user-stories/auth/US-Auth-05-Session-management.md).
