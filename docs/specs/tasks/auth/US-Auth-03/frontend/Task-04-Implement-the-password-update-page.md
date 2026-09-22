## Implement the password update page

Needs: [Task-02 — auth-api: Implement POST /auth/password-reset/confirm](../backend/Task-02-auth-api-Implement-POST-auth-password-reset-confirm.md)

Build the page the emailed link opens, outside the layout: a new password and its confirmation, with the same rules as
sign-up.

Main flow:

1. User submits.
2. The app calls the confirm endpoint with the token from the URL.
3. The user lands on the log in page with a "Password changed" notification, shown once.

Branch — the link is expired or invalid:

1. The page explains what happened and offers to request a new one.

Why: the user is sent to log in rather than straight into the app, because the reset has just ended every session of the
account — including the one that might have been open in this browser.
