## auth-api: Implement GET /auth/email-change

Needs: [Task-01 — auth-api: Implement POST /auth/email-change](Task-01-auth-api-Implement-POST-auth-email-change.md)

`GET /auth/email-change` — the seconds left on the account's cooldown, or none

Why: the answer is the remaining TTL of the cooldown's Redis key, so there is no stored timestamp to keep in step. The
Account tab reads it on load, which is what makes a reload show the real remaining time instead of a reset timer.
