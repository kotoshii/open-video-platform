## auth-api: Implement POST /auth/password-reset/request

Needs: [_platform infrastructure Task-25 — Render emails from Handlebars templates](../../../_platform/infrastructure/Task-25-Render-emails-from-Handlebars-templates.md)

`POST /auth/password-reset/request` — body `{ email }`

Main flow:

1. Start the 60-second cooldown for that address, whether or not it belongs to an account.
2. If it does, mint a single-use reset token, keep it in Redis for 30 minutes, and publish the send-email event. Add
   the template to `email-worker`, in both languages.
3. Answer the same way in either case.

Branch — the cooldown is still running:

1. Answer with the seconds left, which the page shows.

The route is public at the gateway.

Why: the cooldown is started for any address, registered or not, so neither the answer nor the countdown says whether an
account exists. A reset link lives 30 minutes rather than a day, because it is a key to the account.
