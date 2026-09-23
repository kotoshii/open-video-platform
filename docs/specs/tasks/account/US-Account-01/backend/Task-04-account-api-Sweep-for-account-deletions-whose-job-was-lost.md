## account-api: Sweep for account deletions whose job was lost

Needs: [Task-02 — account-api: Implement POST /accounts/deletion/confirm](Task-02-account-api-Implement-POST-accounts-deletion-confirm.md)

Add a repeatable job that looks for accounts whose `deletion_scheduled_at` has passed and whose purge has not started,
and starts it.

A scheduled deletion must survive Redis losing its data: the delayed job is the trigger, `deletion_scheduled_at` is the
record, and this sweep is what catches a job that went missing.

Why: without it the deletion silently never runs while the user believes their data is gone. A repeatable BullMQ job
fires once however many instances run.
