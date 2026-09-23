## Add the password change to the Account tab

Needs: [Task-01 — auth-api: Implement PUT /auth/password](../backend/Task-01-auth-api-Implement-PUT-auth-password.md),
[US-Channels-03 Task-04 — Build the settings page with its tabs](../../../channels/US-Channels-03/frontend/Task-04-Build-the-settings-page-with-its-tabs.md)

Add the password section to the Account tab: "Current password", "New password" and "Confirm password", a hint that the
change signs out every other device, and a "Save" of its own.

Main flow:

1. The fields are checked on the client: the two new ones match, and the password meets the sign-up rules.
2. On save, a success toast; the user stays on the page and the fields are cleared.

Branch — the fields do not pass the check:

1. The errors show under their fields, and nothing is sent.

Branch — the current password is wrong:

1. A field-level error under it.

Branch — the request fails:

1. The default toast behaviour, and the password stays as it was.

Why: the new token pair arrives in the cookies, so the page carries on without a reload and the client has nothing to
store.
