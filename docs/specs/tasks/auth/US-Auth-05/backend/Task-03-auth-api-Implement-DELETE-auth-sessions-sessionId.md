## auth-api: Implement DELETE /auth/sessions/{sessionId}

Needs: [Task-02 — auth-api: Implement GET /auth/sessions](Task-02-auth-api-Implement-GET-auth-sessions.md)

`DELETE /auth/sessions/{sessionId}`

Main flow:

1. Check the session belongs to this account.
2. Delete it in Keycloak and drop its stored row.

Branch — it is not one of the account's sessions, or it is already gone:

1. Return 404, without saying which of the two it was.

Branch — it is the current session:

1. Reject it with its code; the current session ends by logging out
   ([US-Auth-06](../../../../user-stories/auth/US-Auth-06-Logging-out.md)).

Why: deleting the Keycloak session invalidates its refresh token, so that device is cut off at its next refresh — its
access token still works until it expires, which is why that lifetime is 5 minutes.
