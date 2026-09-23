## Add Delete channel to the Channel tab

Needs: [Task-01 — channel-api: Implement POST /channels/current/deletion](../backend/Task-01-channel-api-Implement-POST-channels-current-deletion.md),
[Task-03 — channel-api: Implement POST /channels/deletion/cancel](../backend/Task-03-channel-api-Implement-POST-channels-deletion-cancel.md),
[US-Channels-03 Task-05 — Build the Channel tab form](../../US-Channels-03/frontend/Task-05-Build-the-Channel-tab-form.md)

Main flow:

1. The Channel tab has a "Delete channel" button, styled as destructive.
2. Clicking it opens a modal spelling out the consequences, with "Cancel" on the left and "Yes" on the right.
3. "Yes" stays disabled for 10 seconds, counting down inside the button.
4. Confirming sends the email and says so. Nothing is scheduled yet.

Branch — the account's email is unconfirmed:

1. The button is unavailable and links to the confirmation page
   ([US-Auth-02](../../../../user-stories/auth/US-Auth-02-Account-confirmation.md)).

Branch — this is the last channel without a deletion scheduled:

1. The button is unavailable, saying the last channel goes with the account
   ([US-Account-01](../../../../user-stories/account/US-Account-01-Delete-own-account.md)).

Branch — a deletion is already scheduled:

1. The tab states that, gives the date and time, and offers "Cancel deletion" in place of the button.

Why: the ten seconds are there because this button sits among ordinary settings, and once the window passes there is
nothing to undo.
