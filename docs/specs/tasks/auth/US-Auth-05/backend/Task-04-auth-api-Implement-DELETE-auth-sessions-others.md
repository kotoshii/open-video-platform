## auth-api: Implement DELETE /auth/sessions/others

Needs: [Task-03 — auth-api: Implement DELETE /auth/sessions/{sessionId}](Task-03-auth-api-Implement-DELETE-auth-sessions-sessionId.md)

`DELETE /auth/sessions/others`

Main flow:

1. List the account's sessions in Keycloak.
2. Delete every one whose id is not the token's `sid`, and drop their stored rows.

Why: skipping by `sid` is what keeps the current session alive through an action that otherwise ends everything — the
same mechanism changing a password uses ([US-Account-03](../../../../user-stories/account/US-Account-03-Change-password.md)).
