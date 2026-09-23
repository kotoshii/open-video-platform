## auth-api: Implement POST /auth/email-confirmation/resend

Needs: [Task-02 — auth-api: Send a confirmation email after sign-up](Task-02-auth-api-Send-a-confirmation-email-after-sign-up.md)

`POST /auth/email-confirmation/resend`

Main flow:

1. Check the account's cooldown in Redis.
2. Mint a new token in place of the old one, and restart the cooldown.
3. Publish the send-email event.

Branch — the cooldown is still running:

1. Reject with its code and the seconds left, which the page shows.

Branch — the email is already confirmed:

1. Reject with its code; nothing is sent.

Why: the cooldown is what stops this button being used to flood somebody's inbox, so it is enforced here — a disabled
button is not enforcement.
