## channel-api: Implement POST /channels/deletion/cancel

Needs: [Task-02 — channel-api: Implement POST /channels/deletion/confirm](Task-02-channel-api-Implement-POST-channels-deletion-confirm.md)

`POST /channels/deletion/cancel` — body `{ token }` when it comes from the email, nothing when it comes from the
settings page, where the acting channel says which one it is.

Main flow:

1. Clear `deletion_scheduled_at` and the cancel token, and write the deletion-cancelled event to the outbox.
2. Remove the delayed job.

Branch — nothing is scheduled for that channel:

1. Answer as a success.

Why: cancelling has nothing to put back except the videos' visibility, which is the whole point of scheduling a deletion
instead of starting one. Afterwards the channel can be scheduled again exactly as before.
