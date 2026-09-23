## account-api: Implement POST /accounts/current/deletion

Needs: [US-I18n-03 Task-02 — Store and change the account's email language](../../../i18n/US-I18n-03/backend/Task-02-Store-and-change-the-accounts-email-language.md),
[_platform infrastructure Task-25 — Render emails from Handlebars templates](../../../_platform/infrastructure/Task-25-Render-emails-from-Handlebars-templates.md)

`POST /accounts/current/deletion`

Main flow:

1. Refuse unless the account's email is confirmed, read from the `Email-Verified` header.
2. Mint a single-use token, keep it in Redis for 5 minutes, and publish the send-email event. Add the template to
   `email-worker` in both languages; it spells out again that every channel of the account goes with it.

Branch — the email is unconfirmed, or a deletion is already scheduled:

1. Reject with its code.

Why: the emailed link is what authorises the deletion, so it only proves anything when the inbox is known to be the
user's. Nothing is scheduled and no session ends here — this step only sends the link.
