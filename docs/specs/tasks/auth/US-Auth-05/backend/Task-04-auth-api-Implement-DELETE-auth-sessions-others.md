## auth-api: Implement DELETE /auth/sessions/others

Needs: [Task-03 — auth-api: Implement DELETE /auth/sessions/{sessionId}](Task-03-auth-api-Implement-DELETE-auth-sessions-sessionId.md),
[US-Account-03 Task-01 — auth-api: Implement PUT /auth/password](../../../account/US-Account-03/backend/Task-01-auth-api-Implement-PUT-auth-password.md)

`DELETE /auth/sessions/others`

Main flow:

1. End every session except the current one, with the code changing a password already uses.
2. Drop the stored rows of the sessions it ended.

Why: skipping by `sid` is what keeps the current session alive through an action that otherwise ends everything.
Changing a password needs the same thing and comes earlier in the plan
([US-Account-03](../../../../user-stories/account/US-Account-03-Change-password.md)), so the code is written there and
reused here.
