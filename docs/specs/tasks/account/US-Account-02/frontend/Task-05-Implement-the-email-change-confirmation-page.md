## Implement the email change confirmation page

Needs: [Task-03 — auth-api: Implement POST /auth/email-change/confirm](../backend/Task-03-auth-api-Implement-POST-auth-email-change-confirm.md),
[US-Auth-01 Task-08 — auth-api: Implement POST /auth/login](../../../auth/US-Auth-01/backend/Task-08-auth-api-Implement-POST-auth-login.md)

Build the public page the confirmation link opens, outside the layout.

Main flow:

1. The page takes the token from the URL and calls the confirm endpoint.
2. It says the email has been changed to the new address, and asks for the password.
3. The password logs in with the new address, and the user lands on the homepage. There is no "Open homepage" button.

Branch — the link is expired, invalid or already used:

1. The page explains what happened, with no resend; the user starts over from the settings page.

Branch — the password is wrong:

1. An error, and the user tries again. The change itself is already applied.

Why: the session that started the change is gone by now, so this is simply a login against the new address — the only
way back in.
