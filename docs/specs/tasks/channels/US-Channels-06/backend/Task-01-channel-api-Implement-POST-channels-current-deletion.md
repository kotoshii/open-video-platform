## channel-api: Implement POST /channels/current/deletion

Needs: [_platform infrastructure Task-25 — Render emails from Handlebars templates](../../../_platform/infrastructure/Task-25-Render-emails-from-Handlebars-templates.md)

`POST /channels/current/deletion`

Main flow:

1. Refuse unless the account's email is confirmed, read from the `Email-Verified` header.
2. Refuse unless the account has another channel without a deletion already scheduled.
3. Mint a single-use token, keep it in Redis for 5 minutes, and publish the send-email event. Add the template to
   `email-worker` in both languages; it spells out the consequences again.

Branch — the email is unconfirmed, or this is the account's last channel:

1. Reject with its code — the same reason the button in the settings is unavailable.

Why: the emailed link is what authorises the deletion, so it only proves anything when the inbox is known to be the
user's. A disabled button is not the enforcement, which is why both rules are checked here as well.
