## auth-api: Implement GET /auth/email-confirmation

Needs: [Task-02 — auth-api: Send a confirmation email after sign-up](Task-02-auth-api-Send-a-confirmation-email-after-sign-up.md)

`GET /auth/email-confirmation`

Returns whether the account's email is confirmed, and how many seconds are left before another link can be sent.

Why: the confirmation page has to survive a reload, and both the countdown and the "already confirmed" state come from
the server rather than from anything the page kept.
