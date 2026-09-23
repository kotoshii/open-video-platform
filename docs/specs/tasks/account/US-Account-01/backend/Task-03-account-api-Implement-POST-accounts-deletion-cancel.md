## account-api: Implement POST /accounts/deletion/cancel

Needs: [Task-02 — account-api: Implement POST /accounts/deletion/confirm](Task-02-account-api-Implement-POST-accounts-deletion-confirm.md)

`POST /accounts/deletion/cancel` — body `{ token }` when it comes from the email, nothing when it comes from the
settings page, where the `User-ID` header says which account it is

Main flow:

1. Clear `deletion_scheduled_at` and the cancel token, and write the deletion-cancelled event to the outbox.
2. Remove the delayed job.

Branch — nothing is scheduled:

1. Answer as a success.

Why: the two schedules are independent — cancelling the account's deletion leaves a channel's own deletion scheduled,
and the other way round ([US-Account-01](../../../../user-stories/account/US-Account-01-Delete-own-account.md)).
