## auth-api: Send a confirmation email after sign-up

Needs: [US-Auth-01 Task-07 — auth-api: Implement POST /auth/sign-up as a saga](../../US-Auth-01/backend/Task-07-auth-api-Implement-POST-auth-sign-up-as-a-saga.md),
[_platform infrastructure Task-25 — Render emails from Handlebars templates](../../../_platform/infrastructure/Task-25-Render-emails-from-Handlebars-templates.md)

When an account is created, mint a single-use confirmation token, keep it in Redis for 24 hours, start the 60-second
resend cooldown, and publish the send-email event carrying the account id and the token. Add the email's template to
`email-worker`, in both languages; the template builds the link to the confirmation page from the token.

Why: the email goes out as an event, so creating an account neither waits for mail delivery nor fails when the mail
server is down. The token lives in Redis because it is short-lived and expires on its own.
