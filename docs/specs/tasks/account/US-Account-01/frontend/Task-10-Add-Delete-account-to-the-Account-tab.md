## Add Delete account to the Account tab

Needs: [Task-01 — account-api: Implement POST /accounts/current/deletion](../backend/Task-01-account-api-Implement-POST-accounts-current-deletion.md),
[Task-03 — account-api: Implement POST /accounts/deletion/cancel](../backend/Task-03-account-api-Implement-POST-accounts-deletion-cancel.md),
[US-Channels-06 Task-17 — Add Delete channel to the Channel tab](../../../channels/US-Channels-06/frontend/Task-17-Add-Delete-channel-to-the-Channel-tab.md)

Main flow:

1. The Account tab has a "Delete account" button, styled as destructive.
2. Clicking it opens a modal spelling out the consequences, including that every channel of the account goes with it,
   with "Cancel" on the left and "Yes" on the right.
3. "Yes" stays disabled for 10 seconds, counting down inside the button.
4. Confirming sends the email and says so. Nothing is scheduled yet.

Branch — the account's email is unconfirmed:

1. The button is unavailable and links to the confirmation page
   ([US-Auth-02](../../../../user-stories/auth/US-Auth-02-Account-confirmation.md)).

Branch — a deletion is already scheduled:

1. The tab states that, gives the date and time, and offers "Cancel deletion" in place of the button.

Why: reuse the modal with the countdown from deleting a channel — the same component with its own text.
